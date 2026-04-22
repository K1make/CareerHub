import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { students } from '../data/mockData';
import {
  CheckCircle2, MapPin, GraduationCap, Users, Search, Filter,
  ChevronRight, Sparkles, Star, ArrowUpRight, Brain, Code2
} from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

function GpaBar({ gpa }) {
  const max = 4.0;
  const pct = (gpa / max) * 100;
  const color = gpa >= 3.4 ? 'bg-emerald-500' : gpa >= 3.0 ? 'bg-primary-container' : 'bg-amber-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${gpa >= 3.4 ? 'text-emerald-400' : gpa >= 3.0 ? 'text-primary' : 'text-amber-400'}`}>
        {gpa.toFixed(1)}
      </span>
    </div>
  );
}

function AvatarPill({ initials }) {
  const colors = [
    'from-primary-container to-indigo-700',
    'from-emerald-600 to-secondary-container',
    'from-tertiary-container to-amber-600',
    'from-indigo-600 to-primary-container',
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-glass`}>
      {initials}
    </div>
  );
}

function StudentCard({ student, onTest }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative glass-card p-5 rounded-xl transition-all duration-300 cursor-pointer group ${hovered ? 'border-outline shadow-glass-lg scale-[1.01]' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top border highlight */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Available badge */}
      {student.available && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-slow" />
          <span className="text-xs text-emerald-400 font-medium">Открыт</span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <AvatarPill initials={student.initials} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-on-surface text-sm leading-tight mb-0.5 truncate">{student.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-outline">
            <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{student.university} · {student.specialty}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-outline mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{student.location}</span>
          </div>
        </div>
      </div>

      {/* GPA */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">GPA</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            student.level === 'Middle' ? 'badge-indigo' : 'badge-amber'
          }`}>{student.level}</span>
        </div>
        <GpaBar gpa={student.gpa} />
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {student.skills.map(skill => (
          skill.verified ? (
            <span key={skill.name} className="skill-tag-verified">
              <CheckCircle2 className="w-3 h-3" />
              {skill.name}
            </span>
          ) : (
            <span key={skill.name} className="skill-tag">{skill.name}</span>
          )
        ))}
      </div>

      {/* Verified note */}
      {student.skills.some(s => s.verified) && (
        <p className="text-xs text-emerald-400/70 mb-3 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          ИИ-верификация пройдена
        </p>
      )}

      {/* Actions */}
      <div className={`flex gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          id={`view-profile-${student.id}`}
          className="btn-ghost text-xs py-1.5 px-3 flex-1 justify-center"
        >
          Профиль <ArrowUpRight className="w-3 h-3" />
        </button>
        <button
          id={`connect-${student.id}`}
          className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center"
        >
          Связаться
        </button>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.name.toLowerCase().includes(search.toLowerCase()));
    const matchLevel = filterLevel === 'All' || s.level === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/80 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              id="logo-btn"
              className="flex items-center gap-2.5"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-container shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-on-surface">CareerAI</span>
            </button>
            <nav className="hidden md:flex items-center gap-1">
              <span className="nav-link-active">База студентов</span>
              <button id="nav-test" className="nav-link" onClick={() => navigate('/test')}>ИИ-Тест</button>
              <button id="nav-pricing" className="nav-link" onClick={() => navigate('/pricing')}>Тарифы</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button id="header-test-btn" className="btn-primary text-sm py-2 px-4" onClick={() => navigate('/test')}>
              <Brain className="w-4 h-4" />
              Пройти тест
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">База талантов</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            Студенты МУИТ — <span className="text-gradient">Искусственный Интеллект</span>
          </h1>
          <p className="text-on-surface-variant text-base">
            {students.length} верифицированных кандидатов · Данные синхронизированы с базой университета
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              id="student-search"
              type="text"
              className="input-field pl-11"
              placeholder="Поиск по имени или навыку..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-outline flex-shrink-0" />
            {['All', 'Middle', 'Junior'].map(level => (
              <button
                key={level}
                id={`filter-${level}`}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filterLevel === level
                    ? 'bg-primary-container text-white shadow-glow-sm'
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant hover:border-outline hover:text-on-surface'
                }`}
                onClick={() => setFilterLevel(level)}
              >
                {level === 'All' ? 'Все' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in">
          {[
            { label: 'Всего студентов', value: students.length, icon: Users, color: 'text-primary' },
            { label: 'С ИИ-верификацией', value: students.filter(s => s.skills.some(sk => sk.verified)).length, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Открыты к оферам', value: students.filter(s => s.available).length, icon: Star, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-4 rounded-xl text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-on-surface">{value}</div>
              <div className="text-xs text-outline mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {filtered.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                onTest={() => navigate('/test')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-xl">
            <Code2 className="w-10 h-10 text-outline mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">Студенты не найдены</p>
            <p className="text-outline text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>

      <ChatWidget />
    </div>
  );
}
