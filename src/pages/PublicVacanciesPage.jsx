import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import { api } from '../api/client';

export default function PublicVacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.allVacancies().then(setVacancies).catch(console.error).finally(() => setLoading(false));
  }, []);

  return <div className="min-h-screen bg-background"><AppNavbar />
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8"><p className="section-label mb-2">Карьерные возможности</p><h1 className="text-3xl font-bold text-on-surface">Активные вакансии</h1><p className="text-sm text-on-surface-variant mt-2">Показываем только опубликованные компаниями вакансии.</p></div>
      {loading ? <LoadingState count={6} /> : vacancies.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{vacancies.map(vacancy => <article key={vacancy.id} className="glass-card p-5 flex flex-col gap-4"><div><div className="flex justify-between gap-3"><h2 className="font-semibold text-on-surface">{vacancy.title}</h2><span className="badge badge-indigo">{vacancy.type}</span></div><p className="text-sm text-on-surface-variant mt-2">{vacancy.company?.name}</p></div><p className="text-sm text-on-surface-variant line-clamp-3">{vacancy.description}</p><div className="mt-auto text-xs text-on-surface-variant space-y-1"><div className="flex gap-1.5 items-center"><MapPin className="w-3.5 h-3.5" />{vacancy.location}</div><div className="flex gap-1.5 items-center"><Clock className="w-3.5 h-3.5" />{new Date(vacancy.created_at).toLocaleDateString('ru-RU')}</div></div><button onClick={() => navigate(`/vacancies/${vacancy.id}`)} className="btn-primary text-sm">Подробнее и откликнуться</button></article>)}</div> : <EmptyState icon={Briefcase} title="Сейчас нет активных вакансий" description="Загляните позже — новые вакансии появятся здесь." />}
    </main>
  </div>;
}
