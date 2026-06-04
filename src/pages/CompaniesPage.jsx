import { useState, useMemo, useEffect } from 'react';
import {
  MapPin, Search, Briefcase, ExternalLink, Building2,
  CheckCircle2, SlidersHorizontal, X, Users
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../api/client';
import { companies as fallbackCompanies } from '../data/mockData';

const INDUSTRIES = ['Все', 'IT / Classifieds', 'FinTech / E-commerce', 'FinTech', 'E-commerce', 'Smart City / AI', 'IT Outsourcing', 'IT / Search / AI'];
const SIZES = ['Все', '200–500', '500–1000', '1000–5000', '5000+'];
const LOCATIONS = ['Все', 'Алматы', 'Астана', 'Астана · Алматы'];

function CompanyCard({ company }) {
  return (
    <div className="glass-card card-hover p-5 flex flex-col h-full group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface font-bold text-sm flex-shrink-0">
            {company.initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-on-surface text-sm leading-tight truncate">{company.name}</h3>
            <p className="text-xs text-on-surface-variant truncate">{company.industry}</p>
          </div>
        </div>
        {company.available && company.openJobs > 0 ? (
          <span className="badge badge-green text-[10px] flex-shrink-0 ml-2">
            <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
            Найм
          </span>
        ) : (
          <span className="badge badge-outline text-[10px] flex-shrink-0 ml-2">Нет найма</span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-2 flex-1">
        {company.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {company.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {company.size} сотр.
        </span>
        {company.openJobs > 0 && (
          <span className="flex items-center gap-1.5 text-tertiary font-medium">
            <Briefcase className="w-3.5 h-3.5" />
            {company.openJobs} вакансий
          </span>
        )}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {company.skills.slice(0, 3).map(skill => (
          skill.verified ? (
            <span key={skill.name} className="skill-tag-verified">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              {skill.name}
            </span>
          ) : (
            <span key={skill.name} className="skill-tag">{skill.name}</span>
          )
        ))}
      </div>

      {/* CTA */}
      <button
        className="btn-secondary w-full text-xs py-2 mt-auto group-hover:border-primary/30 group-hover:text-primary transition-colors"
        onClick={() => window.open(`https://hh.kz/search/vacancy?text=${encodeURIComponent(company.name)}`, '_blank')}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Смотреть вакансии
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

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('Все');
  const [size, setSize] = useState('Все');
  const [location, setLocation] = useState('Все');
  const [onlyWithJobs, setOnlyWithJobs] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadCompanies() {
      try {
        const data = await api.companies();
        if (active) setCompanies(data);
      } catch (err) {
        if (active) {
          setCompanies(fallbackCompanies);
          setError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCompanies();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.skills.some(s => s.name.toLowerCase().includes(q));
      const matchIndustry = industry === 'Все' || c.industry === industry;
      const matchSize = size === 'Все' || c.size === size;
      const matchLocation = location === 'Все' || c.location.includes(location.split(' ·')[0]);
      const matchJobs = !onlyWithJobs || c.openJobs > 0;
      return matchSearch && matchIndustry && matchSize && matchLocation && matchJobs;
    });
  }, [search, industry, size, location, onlyWithJobs]);

  const hasFilters = industry !== 'Все' || size !== 'Все' || location !== 'Все' || onlyWithJobs || search;

  const clearFilters = () => {
    setSearch('');
    setIndustry('Все');
    setSize('Все');
    setLocation('Все');
    setOnlyWithJobs(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          icon={Building2}
          eyebrow="База работодателей"
          title="Компании-партнёры"
          subtitle={`${companies.length} ведущих компаний. Выберите идеальное место работы.`}
        />
        {error && (
          <div className="alert-info mb-4 text-xs">
            API fallback: {error}
          </div>
        )}

        {/* Search + filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
            <input
              id="companies-search"
              type="text"
              className="input-field pl-10"
              placeholder="Поиск по названию, индустрии или технологии..."
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
            {/* Industry */}
            <div>
              <p className="section-label mb-2">Индустрия</p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(v => (
                  <FilterChip key={v} label={v} active={industry === v} onClick={() => setIndustry(v)} />
                ))}
              </div>
            </div>
            {/* Size */}
            <div>
              <p className="section-label mb-2">Размер компании</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(v => (
                  <FilterChip key={v} label={v === 'Все' ? 'Все' : `${v} сотр.`} active={size === v} onClick={() => setSize(v)} />
                ))}
              </div>
            </div>
            {/* Location */}
            <div>
              <p className="section-label mb-2">Локация</p>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map(v => (
                  <FilterChip key={v} label={v} active={location === v} onClick={() => setLocation(v)} />
                ))}
              </div>
            </div>
            {/* Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setOnlyWithJobs(v => !v)}
                className={`relative w-10 h-5 rounded-full border transition-colors duration-200 ${onlyWithJobs ? 'bg-primary border-primary' : 'bg-surface-container-high border-outline-variant'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${onlyWithJobs ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-on-surface-variant">Только с открытыми вакансиями</span>
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-on-surface-variant">
              Найдено <span className="font-semibold text-on-surface">{filtered.length}</span> из {companies.length} компаний
            </p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <LoadingState count={8} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {filtered.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="Компании не найдены"
            description="Попробуйте изменить параметры поиска или сбросить фильтры."
            action={hasFilters ? { label: 'Сбросить фильтры', onClick: clearFilters } : undefined}
          />
        )}
      </main>

      <ChatWidget />
    </div>
  );
}
