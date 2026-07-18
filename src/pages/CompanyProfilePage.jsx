import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Mail,
  Link2,
  Briefcase,
  Clock,
  ArrowLeft,
  ExternalLink,
  FileText,
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import LoadingState from '../components/ui/LoadingState';
import { api } from '../api/client';

export default function CompanyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCompany() {
      try {
        const result = await api.companyProfile(id);
        setData(result);
      } catch (err) {
        setError('Не удалось загрузить профиль компании.');
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <LoadingState count={4} />
        </div>
      </div>
    );
  }

  if (error || !data?.company) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-on-surface mb-4">{error || 'Компания не найдена'}</h2>
          <button onClick={() => navigate('/companies')} className="btn-primary">Вернуться к вакансиям</button>
        </div>
      </div>
    );
  }

  const { company, vacancies } = data;
  const initials = company.name
    ? company.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (company.email?.[0] || '?').toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-12">
      <AppNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => navigate('/companies')}
          className="group flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-outline-variant/30 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Назад к вакансиям
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-slide-up space-y-6">
        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-surface-container to-surface-container-high relative">
            <div className="absolute -bottom-10 left-6">
              <div className="w-24 h-24 rounded-3xl bg-surface border-4 border-surface flex items-center justify-center text-3xl font-bold text-on-surface shadow-glow select-none">
                {initials}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-on-surface tracking-tight">{company.name || company.email}</h1>
                  <span className="badge badge-indigo">Компания</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{company.email}</span>
                  {company.phone && (<span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{company.phone}</span>)}
                  {company.github_url && (
                    <a
                      href={company.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Link2 className="w-4 h-4" />Сайт / GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-4 h-4 text-on-surface-variant" />
                <h2 className="text-base font-semibold text-on-surface">О компании</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {company.about || 'Описание компании пока отсутствует. Здесь появится информация о миссии, культуре и вакансиях.'}
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-4 h-4 text-on-surface-variant" />
                <h2 className="text-base font-semibold text-on-surface">Открытые вакансии</h2>
              </div>
              {vacancies.length === 0 ? (
                <p className="text-sm text-on-surface-variant">Пока нет активных вакансий.</p>
              ) : (
                <div className="space-y-4">
                  {vacancies.map(vacancy => (
                    <div key={vacancy.id} className="border border-outline-variant rounded-3xl p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-on-surface text-base">{vacancy.title}</h3>
                          <p className="text-xs text-on-surface-variant">{vacancy.location} · {vacancy.type}</p>
                        </div>
                        {vacancy.salary && <span className="badge badge-indigo text-[10px] whitespace-nowrap">{vacancy.salary}</span>}
                      </div>
                      {vacancy.description && (
                        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-3">{vacancy.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(vacancy.created_at).toLocaleDateString('ru-RU')}</span>
                        {vacancy.department && <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{vacancy.department}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface mb-4">Контакты</h2>
              <div className="space-y-3 text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {company.email}
                </div>
                {company.phone && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {company.phone}
                  </div>
                )}
                {company.github_url && (
                  <a href={company.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <ExternalLink className="w-4 h-4" />{company.github_url}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
