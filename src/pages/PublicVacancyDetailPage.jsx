import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import LoadingState from '../components/ui/LoadingState';
import { api } from '../api/client';

export default function PublicVacancyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState(null);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  useEffect(() => { api.vacancy(id).then(setVacancy).catch(err => setError(err.message)); }, [id]);
  const apply = async () => { try { await api.applyToVacancy(id); setApplied(true); } catch (err) { setError(err.message); } };
  return <div className="min-h-screen bg-background"><AppNavbar /><main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">{!vacancy ? <LoadingState /> : <><button onClick={() => navigate('/vacancies-public')} className="btn-ghost mb-6"><ArrowLeft className="w-4 h-4" /> Назад к вакансиям</button><article className="glass-card p-7 space-y-6"><div><div className="flex justify-between gap-4"><h1 className="text-2xl font-bold text-on-surface">{vacancy.title}</h1><span className="badge badge-indigo">{vacancy.type}</span></div><p className="text-on-surface-variant mt-2">{vacancy.company?.name}</p><div className="flex gap-4 text-sm text-on-surface-variant mt-4"><span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{vacancy.location}</span>{vacancy.salary && <span>{vacancy.salary}</span>}</div></div><div><h2 className="font-semibold text-on-surface mb-2">О вакансии</h2><p className="text-on-surface-variant whitespace-pre-line">{vacancy.description}</p></div><div><h2 className="font-semibold text-on-surface mb-2">Требования</h2><ul className="list-disc pl-5 text-on-surface-variant">{(vacancy.requirements || []).map(item => <li key={item}>{item}</li>)}</ul></div>{error && <p className="text-sm text-error">{error}</p>}<button onClick={apply} disabled={applied} className="btn-primary"> <Briefcase className="w-4 h-4" /> {applied ? 'Отклик отправлен' : 'Откликнуться'} </button></article></>}</main></div>;
}
