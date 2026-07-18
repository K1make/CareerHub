import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  GraduationCap, MapPin, Briefcase, Award, Code2, BookOpen, CheckCircle2, ArrowLeft, UserCircle
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import LoadingState from '../components/ui/LoadingState';
import { api } from '../api/client';

export default function CandidateProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invited, setInvited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.candidateProfile(id);
        setCandidate(data);
      } catch (err) {
        setError('Не удалось загрузить профиль кандидата.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!candidate?.contacts_available) return;
    api.candidateContacts(id).then(setContacts).catch(() => setContacts(null));
  }, [candidate?.contacts_available, id]);

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

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-on-surface mb-4">{error || 'Кандидат не найден'}</h2>
          <button onClick={() => navigate('/candidates')} className="btn-primary">Вернуться к списку</button>
        </div>
      </div>
    );
  }

  const initials = candidate.name
    ? candidate.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  const invite = async () => {
    if (invited || submitting) return;
    setSubmitting(true);
    try {
      await api.inviteCandidate(candidate.id);
    } catch {
      // optimistic UX
    } finally {
      setInvited(true);
      setSubmitting(false);
    }
  };

  const mySkills = candidate.skills || [];
  const about = candidate.about || 'Backend-разработчик с фокусом на Python и Django. Активно изучаю DevOps-практики и облачные технологии. Ищу позицию Junior/Middle Backend Developer в продуктовой компании.';
  
  const testResults = candidate.test_results || [];

  const education = [
    { school: candidate.university || 'МУИТ (IITU)', degree: 'Бакалавр — Информационные технологии', years: '2022–2026', gpa: '3.3' },
  ];

  const experience = candidate.experience || [];

  const projects = candidate.projects || [];

  return (
    <div className="min-h-screen bg-background pb-12">
      <AppNavbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={() => navigate('/candidates')}
          className="group flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-outline-variant/30 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Назад
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 animate-slide-up space-y-6">
        {/* Hero card */}
        <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-surface-container to-surface-container-high relative">
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              <div className="w-20 h-20 rounded-2xl bg-surface border-4 border-surface flex items-center justify-center text-2xl font-bold text-on-surface shadow-glass-lg select-none" style={{ background: '#18181b' }}>
                {initials}
              </div>
            </div>
          </div>
          <div className="pt-14 pb-6 px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-on-surface tracking-tight">{candidate.name || 'Кандидат'}</h1>
                  {candidate.role === 'student' ? (
                    <span className="badge badge-indigo">Студент</span>
                  ) : (
                    <span className="badge badge-outline">Соискатель</span>
                  )}
                  {candidate.specialization && <span className="badge badge-green">{candidate.specialization}</span>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                  {candidate.role === 'student' && (
                    <>
                      <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" />{candidate.university || 'Университет не указан'}</span>
                      <span className="flex items-center gap-1.5"><span className="text-outline text-xs">GPA:</span><span className="font-semibold text-on-surface text-xs">3.3</span></span>
                    </>
                  )}
                  {candidate.student_id && (
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />ID: {candidate.student_id}</span>
                  )}
                  {candidate.city && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{candidate.city}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`btn-primary text-xs py-2 px-3 flex items-center gap-2 ${invited ? '!bg-tertiary/20 !text-tertiary !border-tertiary/20' : ''}`}
                  onClick={invite}
                  disabled={invited || submitting}
                >
                  <Briefcase className="w-3.5 h-3.5" /> 
                  {invited ? 'Приглашение отправлено ✓' : submitting ? 'Отправка...' : 'Пригласить'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-on-surface-variant" /> О себе
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{about}</p>
            </div>

            {/* Experience */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-on-surface-variant" /> Опыт работы
              </h2>
              <div className="space-y-4">
                {experience.map((ex, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface text-sm">{ex.role}</div>
                      <div className="text-xs text-on-surface-variant/80 mb-1">{ex.company} · {ex.start_date}{ex.is_current ? ' — по настоящее время' : ex.end_date ? ` — ${ex.end_date}` : ''}</div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{ex.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-on-surface-variant" /> Проекты
              </h2>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant">
                    <div className="font-semibold text-on-surface text-sm mb-1">{p.name}</div>
                    <p className="text-xs text-on-surface-variant mb-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.map(t => <span key={t} className="skill-tag">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {contacts && (
              <div className="glass-card p-6">
                <h2 className="text-base font-semibold text-on-surface mb-3">Контакты</h2>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  {contacts.email && <div>{contacts.email}</div>}
                  {contacts.phone && <div>{contacts.phone}</div>}
                  {contacts.github_url && <a href={contacts.github_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">GitHub</a>}
                </div>
              </div>
            )}
            {/* Skills */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-on-surface-variant" /> Навыки
              </h2>
              <div className="flex flex-wrap gap-2">
                {mySkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface border border-outline text-on-surface"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-on-surface-variant" /> Образование
              </h2>
              {candidate.role === 'student' ? (
                education.map((ed, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface text-sm">{ed.school}</div>
                      <div className="text-xs text-on-surface-variant">{ed.degree}</div>
                      <div className="text-xs text-outline">{ed.years} · GPA {ed.gpa}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {candidate.education_info || 'Без высшего образования'}
                    </p>
                    {candidate.diploma_file && (
                      <a href={candidate.diploma_file} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                        Смотреть диплом
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Test Results */}
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-on-surface-variant" /> Результаты тестов
              </h2>
              <div className="space-y-4">
                {testResults.map((tr, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-container rounded-xl border border-outline-variant">
                    <div>
                      <div className="font-semibold text-on-surface text-sm flex items-center gap-2">
                        {tr.tech}
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-xs text-outline">{tr.level} · {tr.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary text-sm">{tr.score}%</div>
                      <div className="text-[10px] uppercase tracking-wide text-outline">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
