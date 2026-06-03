import { useState } from 'react';
import {
  GraduationCap, MapPin, X, Plus, Mail, Phone, Globe, Briefcase,
  Award, Code2, BookOpen, CheckCircle2, Building2, Users, ExternalLink, Edit3
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../context/AuthContext';

const availableSkills = [
  'Python', 'Django', 'FastAPI', 'Pandas', 'NumPy',
  'Java', 'Spring Boot', 'Kotlin', 'Android SDK',
  'JavaScript', 'React', 'Node.js', 'Vue', 'TypeScript',
  'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Linux', 'SQL'
];

// ─── Student Profile ──────────────────────────────────────────────────────────
function StudentProfile({ name }) {
  const [mySkills, setMySkills] = useState(['Python', 'Django', 'PostgreSQL', 'Docker']);
  const [editingAbout, setEditingAbout] = useState(false);
  const [about, setAbout] = useState('Backend-разработчик с фокусом на Python и Django. Активно изучаю DevOps-практики и облачные технологии. Ищу позицию Junior/Middle Backend Developer в продуктовой компании.');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillText, setNewSkillText] = useState('');

  const initials = name
    ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'М';

  const toggleSkill = (skill) => {
    setMySkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleCustomSkillAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = newSkillText.trim();
      if (trimmed && !mySkills.includes(trimmed)) {
        setMySkills(prev => [...prev, trimmed]);
      }
      setNewSkillText('');
      setIsAddingSkill(false);
    } else if (e.key === 'Escape') {
      setNewSkillText('');
      setIsAddingSkill(false);
    }
  };

  const testResults = [
    { tech: 'Python', level: 'Middle', score: 82, date: 'Май 2026' },
    { tech: 'PostgreSQL', level: 'Junior', score: 74, date: 'Апр 2026' },
  ];

  const education = [
    { school: 'МУИТ (IITU)', degree: 'Бакалавр — Информационные технологии', years: '2022–2026', gpa: '3.3' },
  ];

  const experience = [
    { company: 'Kolesa Group', role: 'Backend Intern', period: 'Июнь–Авг 2025', desc: 'Разрабатывал REST API на Django, участвовал в code review, написал юнит-тесты.' },
  ];

  const projects = [
    { name: 'CareerAI', desc: 'AI-платформа для матчинга студентов и работодателей.', tech: ['React', 'Python', 'FastAPI'] },
    { name: 'Budget Tracker', desc: 'Телеграм-бот для учёта личных финансов.', tech: ['Python', 'PostgreSQL'] },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-slide-up space-y-6">
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
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">{name || 'Мансур'}</h1>
                <span className="badge badge-green">Junior</span>
                <span className="badge badge-indigo">Backend Dev</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" />МУИТ · 3 курс</span>
                <span className="flex items-center gap-1.5"><span className="text-outline text-xs">GPA:</span><span className="font-semibold text-on-surface text-xs">3.3</span></span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />Алматы</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="mailto:mansur@iitu.kz" className="btn-secondary text-xs py-2 px-3">
                <Mail className="w-3.5 h-3.5" /> Написать
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-on-surface-variant" /> О себе
              </h2>
              <button onClick={() => setEditingAbout(v => !v)} className="btn-ghost py-1 px-2 text-xs gap-1">
                <Edit3 className="w-3 h-3" /> {editingAbout ? 'Сохранить' : 'Изменить'}
              </button>
            </div>
            {editingAbout ? (
              <textarea
                className="input-field resize-none text-sm leading-relaxed"
                rows={4}
                value={about}
                onChange={e => setAbout(e.target.value)}
              />
            ) : (
              <p className="text-sm text-on-surface-variant leading-relaxed">{about}</p>
            )}
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
                    <div className="text-xs text-on-surface-variant mb-1">{ex.company} · {ex.period}</div>
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
                <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant hover:border-outline transition-colors">
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
          {/* Skills */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-on-surface-variant" /> Навыки
            </h2>
            <div className="flex flex-wrap gap-2 min-h-[40px] mb-4">
              {mySkills.length > 0 ? mySkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface border border-outline hover:border-error hover:text-error transition-all duration-200 text-on-surface"
                >
                  {skill}
                  <X className="w-3 h-3 text-outline group-hover:text-error transition-colors" />
                </button>
              )) : (
                <span className="text-xs text-outline italic">Добавьте навыки ниже</span>
              )}
            </div>
            <div className="pt-4 border-t border-outline-variant/40">
              <div className="flex items-center gap-2 mb-3 h-7">
                {!isAddingSkill ? (
                  <button 
                    onClick={() => setIsAddingSkill(true)}
                    className="section-label hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> ДОБАВИТЬ
                  </button>
                ) : (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Введите навык и нажмите Enter..."
                    value={newSkillText}
                    onChange={e => setNewSkillText(e.target.value)}
                    onKeyDown={handleCustomSkillAdd}
                    onBlur={() => setIsAddingSkill(false)}
                    className="input-field py-1 px-2.5 text-xs w-full max-w-[200px]"
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableSkills.filter(s => !mySkills.includes(s)).slice(0, 12).map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface hover:border-outline hover:text-on-surface transition-all duration-200"
                  >
                    <Plus className="w-3 h-3" /> {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-on-surface-variant" /> Образование
            </h2>
            {education.map((ed, i) => (
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
            ))}
          </div>

          {/* Test Results */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-on-surface-variant" /> Результаты тестов
            </h2>
            <div className="space-y-3">
              {testResults.map((t, i) => (
                <div key={i} className="p-3 bg-surface-container rounded-xl border border-outline-variant">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-on-surface">{t.tech}</span>
                      <span className="ml-2 badge badge-green">{t.level}</span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">{t.score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${t.score}%` }} />
                  </div>
                  <p className="text-xs text-outline mt-1.5">{t.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-on-surface-variant" /> Контакты
            </h2>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">mansur@iitu.kz</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+7 (707) 000-00-00</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <a href="https://github.com" target="_blank" rel="noreferrer">github.com/mansur</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Company Profile ──────────────────────────────────────────────────────────
function CompanyProfile({ name }) {
  const openVacancies = [
    { title: 'Backend Developer (Python)', level: 'Middle', format: 'Hybrid', salary: '600–900K ₸' },
    { title: 'Frontend Developer (React)', level: 'Junior', format: 'Remote', salary: '400–650K ₸' },
    { title: 'DevOps Engineer', level: 'Middle', format: 'Office', salary: '800–1100K ₸' },
  ];

  const formatLabel = { Remote: 'Удалённо', Hybrid: 'Гибрид', Office: 'В офисе' };
  const levelVariant = { Junior: 'badge-green', Middle: 'badge-indigo', Senior: 'badge-amber' };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-slide-up space-y-6">
      {/* Hero */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-surface-container to-surface-container-high" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-surface-container border-4 border-surface flex items-center justify-center text-2xl font-bold text-on-surface shadow-glass" style={{ borderColor: '#09090b' }}>
              {name ? name[0] : 'K'}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">{name || 'Kaspi.kz'}</h1>
                <span className="badge badge-indigo">FinTech</span>
              </div>
              <p className="text-sm text-on-surface-variant">Крупнейшая финтех-экосистема Казахстана: банк, маркетплейс и платёжная платформа в одном суперприложении.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="https://kaspi.kz" target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3">
                <ExternalLink className="w-3.5 h-3.5" /> Сайт
              </a>
              <button className="btn-primary text-xs py-2 px-3">
                <Edit3 className="w-3.5 h-3.5" /> Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info grid */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface mb-4">Информация о компании</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Building2, label: 'Индустрия', value: 'FinTech / E-commerce' },
                { icon: MapPin, label: 'Локация', value: 'Алматы' },
                { icon: Globe, label: 'Сайт', value: 'kaspi.kz' },
                { icon: Users, label: 'Сотрудников', value: '5 000+' },
                { icon: Briefcase, label: 'Открытых вакансий', value: '47' },
                { icon: CheckCircle2, label: 'Верификация', value: 'Подтверждена' },
              // eslint-disable-next-line no-unused-vars
              ].map(({ icon: InfoIcon, label, value }) => (
                <div key={label} className="bg-surface-container rounded-xl p-3 border border-outline-variant">
                  <div className="flex items-center gap-1.5 mb-1">
                    <InfoIcon className="w-3.5 h-3.5 text-on-surface-variant" />
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">{label}</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open vacancies */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-on-surface-variant" /> Открытые вакансии
              <span className="badge badge-green ml-1">{openVacancies.length}</span>
            </h2>
            <div className="space-y-3">
              {openVacancies.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant hover:border-outline transition-colors">
                  <div>
                    <div className="font-medium text-on-surface text-sm mb-1">{v.title}</div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className={`badge ${levelVariant[v.level]}`}>{v.level}</span>
                      <span className="badge badge-outline">{formatLabel[v.format]}</span>
                      <span className="font-medium text-on-surface">{v.salary}</span>
                    </div>
                  </div>
                  <button className="btn-ghost py-1.5 px-3 text-xs flex-shrink-0">
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Contact person */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface mb-4">Контактное лицо</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface font-bold text-sm">
                АБ
              </div>
              <div>
                <div className="font-medium text-on-surface text-sm">Айгерим Бекова</div>
                <div className="text-xs text-on-surface-variant">HR Business Partner</div>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Mail className="w-4 h-4" /> hr@kaspi.kz
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Phone className="w-4 h-4" /> +7 (727) 000-00-00
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface mb-4">Статистика найма</h2>
            <div className="space-y-3">
              {[
                { label: 'Просмотрено кандидатов', value: '124' },
                { label: 'Отправлено приглашений', value: '18' },
                { label: 'Успешных наймов', value: '5' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">{label}</span>
                  <span className="text-sm font-bold text-on-surface">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ProfilePage (role-aware) ─────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, isCompany } = useAuth();
  const name = user?.name || 'Мансур';

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {isCompany ? <CompanyProfile name={name} /> : <StudentProfile name={name} />}
      <ChatWidget />
    </div>
  );
}
