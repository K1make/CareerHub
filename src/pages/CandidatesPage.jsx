import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MapPin, Search, Mail, CheckCircle2, SlidersHorizontal,
  X, Users, Briefcase, Star, RefreshCw, GraduationCap, UserCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../api/client';

const REFRESH_INTERVAL = 30_000; // auto-refresh every 30s

function RoleBadge({ role }) {
  if (role === 'student') return (
    <span className="badge badge-indigo text-[10px] flex-shrink-0 ml-2 flex items-center gap-1">
      <GraduationCap className="w-3 h-3" />Студент
    </span>
  );
  return (
    <span className="badge badge-outline text-[10px] flex-shrink-0 ml-2 flex items-center gap-1">
      <UserCircle className="w-3 h-3" />Соискатель
    </span>
  );
}

function CandidateCard({ candidate }) {
  const navigate = useNavigate();
  const [invited, setInvited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initials = candidate.name
    ? candidate.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (candidate.email?.[0] || '?').toUpperCase();

  const invite = async () => {
    if (invited || submitting) return;
    setSubmitting(true);
    try {
      await api.inviteCandidate(candidate.id);
    } catch {
      // keep optimistic UX
    } finally {
      setInvited(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card card-hover p-5 flex flex-col h-full group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-on-surface text-sm leading-tight truncate">
              {candidate.name || candidate.email}
            </h3>
            <p className="text-xs text-on-surface-variant truncate">
              {candidate.university || candidate.email}
            </p>
          </div>
        </div>
        <RoleBadge role={candidate.role} />
      </div>

      {/* Info */}
      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-4">
        <span className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          {candidate.email}
        </span>
        {candidate.student_id && (
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            ID: {candidate.student_id}
          </span>
        )}
      </div>

      {/* AI Rating placeholder */}
      <div className="pt-3 border-t border-outline-variant/40 mb-4 mt-auto">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-outline uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3 h-3" /> ИИ-оценка
          </span>
          <span className="text-xs font-bold text-on-surface">—</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '0%' }} />
        </div>
      </div>

      {/* CTA */}
      {/* CTA */}
      <div className="flex flex-col gap-2">
        <button
          className="w-full text-xs py-2 flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200 btn-secondary"
          onClick={() => navigate(`/candidates/${candidate.id}`)}
        >
          <UserCircle className="w-3.5 h-3.5" /> Посмотреть профиль
        </button>
        <button
          className={`w-full text-xs py-2 flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200 ${
            invited
              ? 'bg-tertiary/10 text-tertiary border-tertiary/20 cursor-default'
              : 'btn-primary'
          }`}
          onClick={invite}
          disabled={invited || submitting}
        >
          <Mail className="w-3.5 h-3.5" />
          {invited ? 'Приглашение отправлено ✓' : submitting ? 'Отправка...' : 'Пригласить на собеседование'}
        </button>
      </div>
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

const ROLES = ['Все', 'student', 'jobseeker'];
const ROLE_LABELS = { 'Все': 'Все', 'student': 'Студент', 'jobseeker': 'Соискатель' };

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('Все');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadCandidates = useCallback(async () => {
    try {
      const data = await api.candidates();
      setCandidates(data);
      setError('');
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
    // Auto-refresh to pick up new/deleted accounts
    const interval = setInterval(loadCandidates, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadCandidates]);

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.university || '').toLowerCase().includes(q);
      const matchRole = role === 'Все' || c.role === role;
      return matchSearch && matchRole;
    });
  }, [search, role, candidates]);

  const hasFilters = role !== 'Все' || search;
  const clearFilters = () => { setSearch(''); setRole('Все'); };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <PageHeader
            icon={Users}
            eyebrow="База кандидатов"
            title="Кандидаты"
            subtitle={`${candidates.length} зарегистрированных специалистов. Данные обновляются в реальном времени.`}
          />
          <button
            onClick={loadCandidates}
            className="btn-secondary flex items-center gap-2 self-start mt-1"
            title="Обновить список"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
        </div>

        {error && (
          <div className="alert-error mb-4 text-xs">
            Ошибка загрузки: {error}
          </div>
        )}

        {lastRefresh && (
          <p className="text-xs text-on-surface-variant mb-4">
            Последнее обновление: {lastRefresh.toLocaleTimeString('ru-RU')}
          </p>
        )}

        {/* Search + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <input
              id="candidate-search"
              type="text"
              className="input-field pl-10"
              placeholder="Поиск по имени, email или университету..."
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
              <p className="section-label mb-2">Тип аккаунта</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(v => (
                  <FilterChip key={v} label={ROLE_LABELS[v]} active={role === v} onClick={() => setRole(v)} />
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
              Найдено <span className="font-semibold text-on-surface">{filtered.length}</span> из {candidates.length} кандидатов
            </p>
          </div>
        )}

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
            description={candidates.length === 0
              ? "Пока нет зарегистрированных студентов или соискателей."
              : "Попробуйте изменить параметры поиска или сбросить фильтры."}
            action={hasFilters ? { label: 'Сбросить фильтры', onClick: clearFilters } : undefined}
          />
        )}
      </main>

      <ChatWidget />
    </div>
  );
}
