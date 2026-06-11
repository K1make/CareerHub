import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Search, Briefcase, Building2, X,
  SlidersHorizontal, Clock, DollarSign, RefreshCw, ExternalLink
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../api/client';

const REFRESH_INTERVAL = 30_000;

// ─── Vacancy Detail Modal ──────────────────────────────────────────────────────
function VacancyDetailModal({ vacancy, onClose, onViewCompany }) {
  if (!vacancy) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <h2 className="text-xl font-bold text-on-surface truncate pr-4">{vacancy.title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Company & badges */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {vacancy.company?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{vacancy.company?.name || 'Компания'}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="badge badge-indigo">{vacancy.type}</span>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{vacancy.location}</span>
            {vacancy.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />{vacancy.salary}</span>}
            {vacancy.department && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{vacancy.department}</span>}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>

          {/* Description */}
          {vacancy.description && (
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-2">Описание</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{vacancy.description}</p>
            </div>
          )}

          {/* Requirements */}
          {vacancy.requirements?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-2">Требования</h4>
              <ul className="space-y-1.5">
                {vacancy.requirements.map((r, i) => (
                  <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-outline-variant/30 flex justify-between gap-3 bg-surface-container-lowest">
          <button onClick={onClose} className="btn-secondary">Закрыть</button>
          <button
            onClick={() => onViewCompany(vacancy.company?.id)}
            className="btn-primary flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Профиль компании
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vacancy Card ──────────────────────────────────────────────────────────────
function VacancyCard({ vacancy, onView }) {
  const initials = vacancy.company?.name
    ? vacancy.company.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div
      className="glass-card card-hover p-5 flex flex-col h-full group cursor-pointer"
      onClick={() => onView(vacancy)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-on-surface text-sm leading-tight truncate">{vacancy.title}</h3>
            <p className="text-xs text-on-surface-variant truncate">{vacancy.company?.name || 'Компания'}</p>
          </div>
        </div>
        <span className="badge badge-indigo text-[10px] flex-shrink-0 ml-2 whitespace-nowrap">{vacancy.type}</span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-3">
        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{vacancy.location}</span>
        {vacancy.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{vacancy.salary}</span>}
      </div>

      {vacancy.description && (
        <p className="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-2 flex-1">
          {vacancy.description}
        </p>
      )}

      <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
        <span className="text-xs text-outline flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
        </span>
        <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          <ExternalLink className="w-3 h-3" /> Подробнее
        </span>
      </div>
    </div>
  );
}

// ─── Filter Chip ───────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
        active
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface hover:border-outline'
      }`}
    >
      {label}
    </button>
  );
}

const JOB_TYPES = ['Все', 'Полная занятость', 'Частичная занятость', 'Стажировка', 'Проектная работа'];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('Все');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vacancies, setVacancies] = useState([]);
  const [error, setError] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadVacancies = useCallback(async () => {
    try {
      const data = await api.allVacancies();
      setVacancies(data);
      setError('');
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVacancies();
    const interval = setInterval(loadVacancies, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadVacancies]);

  const filtered = useMemo(() => {
    return vacancies.filter(v => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (v.title || '').toLowerCase().includes(q) ||
        (v.company?.name || '').toLowerCase().includes(q) ||
        (v.location || '').toLowerCase().includes(q);
      const matchType = jobType === 'Все' || v.type === jobType;
      return matchSearch && matchType;
    });
  }, [search, jobType, vacancies]);

  const hasFilters = jobType !== 'Все' || search;
  const clearFilters = () => { setSearch(''); setJobType('Все'); };

  const handleViewCompany = (id) => {
    setSelectedVacancy(null);
    navigate(`/companies/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <PageHeader
            icon={Briefcase}
            eyebrow="Вакансии компаний"
            title="Доступные вакансии"
            subtitle={`${vacancies.length} актуальных вакансий. Данные обновляются в реальном времени.`}
          />
          <button
            onClick={loadVacancies}
            className="btn-secondary flex items-center gap-2 self-start mt-1"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
        </div>

        {error && <div className="alert-error mb-4 text-xs">Ошибка загрузки: {error}</div>}
        {lastRefresh && (
          <p className="text-xs text-on-surface-variant mb-4">
            Последнее обновление: {lastRefresh.toLocaleTimeString('ru-RU')}
          </p>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <input
              id="vacancies-search"
              type="text"
              className="input-field pl-10"
              placeholder="Поиск по названию, компании или локации..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'border-primary/40 text-primary' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Фильтры
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
          </button>
        </div>

        {showFilters && (
          <div className="glass-card p-5 mb-6 animate-fade-in space-y-4">
            <div>
              <p className="section-label mb-2">Тип занятости</p>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(v => (
                  <FilterChip key={v} label={v} active={jobType === v} onClick={() => setJobType(v)} />
                ))}
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-error hover:text-error/80 transition-colors">
                <X className="w-3.5 h-3.5" /> Сбросить фильтры
              </button>
            )}
          </div>
        )}

        {!loading && (
          <div className="mb-6">
            <p className="text-sm text-on-surface-variant">
              Найдено <span className="font-semibold text-on-surface">{filtered.length}</span> из {vacancies.length} вакансий
            </p>
          </div>
        )}

        {loading ? (
          <LoadingState count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {filtered.map(v => (
              <VacancyCard key={v.id} vacancy={v} onView={setSelectedVacancy} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="Вакансии не найдены"
            description={vacancies.length === 0
              ? "Пока ни одна компания не опубликовала вакансии."
              : "Попробуйте изменить параметры поиска или сбросить фильтры."}
            action={hasFilters ? { label: 'Сбросить фильтры', onClick: clearFilters } : undefined}
          />
        )}
      </main>

      {selectedVacancy && (
        <VacancyDetailModal
          vacancy={selectedVacancy}
          onClose={() => setSelectedVacancy(null)}
          onViewCompany={handleViewCompany}
        />
      )}


      <ChatWidget />
    </div>
  );
}
