import { useState, useMemo, useEffect } from 'react';
import {
  MapPin, Search, Mail, CheckCircle2, SlidersHorizontal,
  X, Users, Briefcase, DollarSign, Monitor, Star
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import PageHeader from '../components/ui/PageHeader';
import { candidates } from '../data/mockData';

const LEVELS = ['Все', 'Junior', 'Middle', 'Senior'];
const FORMATS = ['Все', 'Remote', 'Office', 'Hybrid'];
const SKILLS_LIST = ['Python', 'React', 'Java', 'JavaScript', 'TypeScript', 'Docker', 'Kubernetes', 'Figma', 'Kotlin', 'Golang', 'TensorFlow', 'SQL'];

function LevelBadge({ level }) {
  const map = {
    Junior: 'badge-green',
    Middle: 'badge-indigo',
    Senior: 'badge-amber',
  };
  return <span className={`badge ${map[level] || 'badge-outline'}`}>{level}</span>;
}

function FormatBadge({ format }) {
  const map = {
    Remote: 'badge-green',
    Hybrid: 'badge-indigo',
    Office: 'badge-outline',
  };
  const labels = { Remote: 'Удалённо', Hybrid: 'Гибрид', Office: 'В офисе' };
  return <span className={`badge ${map[format] || 'badge-outline'}`}>{labels[format] || format}</span>;
}

function CandidateCard({ candidate }) {
  const [invited, setInvited] = useState(false);

  return (
    <div className="glass-card card-hover p-5 flex flex-col h-full group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface font-bold text-sm flex-shrink-0 select-none">
            {candidate.initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-on-surface text-sm leading-tight truncate">{candidate.name}</h3>
            <p className="text-xs text-on-surface-variant truncate">{candidate.role}</p>
          </div>
        </div>
        {candidate.available
          ? <span className="badge badge-green text-[10px] flex-shrink-0 ml-2"><span className="w-1.5 h-1.5 bg-tertiary rounded-full" />Открыт</span>
          : <span className="badge badge-outline text-[10px] flex-shrink-0 ml-2">Занят</span>
        }
      </div>

      {/* Level + format badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <LevelBadge level={candidate.level} />
        <FormatBadge format={candidate.format} />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {candidate.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          {candidate.experience} {candidate.experience === 1 ? 'год' : 'лет'} опыта
        </span>
      </div>

      {/* Salary */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface mb-3">
        <DollarSign className="w-3.5 h-3.5 text-on-surface-variant" />
        {candidate.salary}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
        {candidate.skills.slice(0, 3).map(skill => (
          skill.verified ? (
            <span key={skill.name} className="skill-tag-verified">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              {skill.name}
            </span>
          ) : (
            <span key={skill.name} className="skill-tag">{skill.name}</span>
          )
        ))}
        {candidate.skills.length > 3 && (
          <span className="skill-tag text-outline">+{candidate.skills.length - 3}</span>
        )}
      </div>

      {/* AI rating */}
      <div className="pt-3 border-t border-outline-variant/40 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-outline uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3 h-3" /> ИИ-оценка
          </span>
          <span className="text-xs font-bold text-on-surface">{candidate.rating.toFixed(1)}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(candidate.rating / 5) * 100}%` }} />
        </div>
      </div>

      {/* CTA */}
      <button
        className={`w-full text-xs py-2 flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200 ${
          invited
            ? 'bg-tertiary/10 text-tertiary border-tertiary/20 cursor-default'
            : 'btn-primary'
        }`}
        onClick={() => setInvited(true)}
        disabled={invited || !candidate.available}
      >
        <Mail className="w-3.5 h-3.5" />
        {invited ? 'Приглашение отправлено ✓' : 'Пригласить на собеседование'}
      </button>
    </div>
  );
}

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

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('Все');
  const [format, setFormat] = useState('Все');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some(s => s.name.toLowerCase().includes(q));
      const matchLevel = level === 'Все' || c.level === level;
      const matchFormat = format === 'Все' || c.format === format;
      const matchSkills = selectedSkills.length === 0 ||
        selectedSkills.every(sk => c.skills.some(s => s.name === sk));
      return matchSearch && matchLevel && matchFormat && matchSkills;
    });
  }, [search, level, format, selectedSkills]);

  const hasFilters = level !== 'Все' || format !== 'Все' || selectedSkills.length > 0 || search;

  const clearFilters = () => {
    setSearch('');
    setLevel('Все');
    setFormat('Все');
    setSelectedSkills([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          icon={Users}
          eyebrow="База кандидатов"
          title="Кандидаты"
          subtitle={`${candidates.length} верифицированных специалистов. Найдите идеального кандидата.`}
        />

        {/* Search + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <input
              id="candidate-search"
              type="text"
              className="input-field pl-10"
              placeholder="Поиск по имени, роли или навыку..."
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

        {/* Expandable filters */}
        {showFilters && (
          <div className="glass-card p-5 mb-6 animate-fade-in space-y-4">
            {/* Level */}
            <div>
              <p className="section-label mb-2">Уровень</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(v => (
                  <FilterChip key={v} label={v} active={level === v} onClick={() => setLevel(v)} />
                ))}
              </div>
            </div>
            {/* Format */}
            <div>
              <p className="section-label mb-2">Формат работы</p>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map(v => (
                  <FilterChip
                    key={v}
                    label={v === 'Все' ? 'Все' : v === 'Remote' ? 'Удалённо' : v === 'Hybrid' ? 'Гибрид' : 'В офисе'}
                    active={format === v}
                    onClick={() => setFormat(v)}
                  />
                ))}
              </div>
            </div>
            {/* Skills */}
            <div>
              <p className="section-label mb-2">Навыки</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map(sk => (
                  <button
                    key={sk}
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 flex items-center gap-1.5 ${
                      selectedSkills.includes(sk)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-on-surface hover:border-outline'
                    }`}
                  >
                    {selectedSkills.includes(sk) && <CheckCircle2 className="w-3 h-3" />}
                    {sk}
                  </button>
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

        {/* Results count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-sm text-on-surface-variant">
              Найдено <span className="font-semibold text-on-surface">{filtered.length}</span> из {candidates.length} кандидатов
            </p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <LoadingState count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {filtered.map(c => (
              <CandidateCard key={c.id} candidate={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Кандидаты не найдены"
            description="Попробуйте изменить параметры поиска или сбросить фильтры."
            action={hasFilters ? { label: 'Сбросить фильтры', onClick: clearFilters } : undefined}
          />
        )}
      </main>

      <ChatWidget />
    </div>
  );
}
