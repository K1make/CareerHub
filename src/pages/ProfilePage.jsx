import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, MapPin, X, Plus, Mail, Phone, Globe, Briefcase,
  Award, Code2, BookOpen, CheckCircle2, Building2, Users, ExternalLink, Edit3, Trash2, Download
} from 'lucide-react';
import OnboardingModal from '../components/OnboardingModal';
import AppNavbar from '../components/AppNavbar';
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../context/AuthContext';

const availableSkills = [
  'Python', 'Django', 'FastAPI', 'Pandas', 'NumPy',
  'Java', 'Spring Boot', 'Kotlin', 'Android SDK',
  'JavaScript', 'React', 'Node.js', 'Vue', 'TypeScript',
  'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Linux', 'SQL'
];

import { api } from '../api/client';

// ─── Student Profile ──────────────────────────────────────────────────────────
function StudentProfile({ name, role, onDelete, user, updateUser }) {
  const [mySkills, setMySkills] = useState(user?.skills || []);
  const [editingAbout, setEditingAbout] = useState(false);
  const [about, setAbout] = useState(user?.about || '');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillText, setNewSkillText] = useState('');
  const [editingEducation, setEditingEducation] = useState(false);
  const [jobseekerEducation, setJobseekerEducation] = useState(user?.education_info || '');
  const [diplomaFile, setDiplomaFile] = useState(null);
  const [specialization, setSpecialization] = useState(user?.specialization || '');
  const [editingSpecialization, setEditingSpecialization] = useState(false);
  const [city, setCity] = useState(user?.city || '');
  const [editingCity, setEditingCity] = useState(false);
  const [contactSharing, setContactSharing] = useState(Boolean(user?.contact_sharing_enabled));
  const fileInputRef = useRef(null);
  
  // Dynamic lists state
  const [experience, setExperience] = useState(user?.experience || []);
  const [editingExperience, setEditingExperience] = useState(false);
  
  const [projects, setProjects] = useState(user?.projects || []);
  const [editingProjects, setEditingProjects] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  // Modal state
  const showOnboarding = user?.role === 'student' || user?.role === 'jobseeker' ? !user?.profile_completed : false;

  const saveProfile = async (data) => {
    try {
      const updatedUser = await api.updateProfile(data);
      if (updateUser && updatedUser) {
        updateUser(updatedUser);
      }
      return true;
    } catch (e) {
      console.error(e);
      setProfileError('Не удалось сохранить изменения. Проверьте поля и повторите попытку.');
      return false;
    }
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    await saveProfile(formData);
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume_file', file);
    const saved = await saveProfile(formData);
    if (saved) setProfileError('');
  };

  const deleteUploadedResume = async () => {
    if (!window.confirm('Удалить загруженное резюме?')) return;
    try {
      await api.deleteUploadedResume();
      updateUser?.({ ...user, resume_file: null });
    } catch {
      setProfileError('Не удалось удалить резюме. Повторите попытку.');
    }
  };

  const finishExperienceEditing = async () => {
    if (editingExperience) {
      if (experience.some(item => !item.company?.trim() || !item.role?.trim() || !item.start_date)) {
        setProfileError('Заполните компанию, должность и дату начала для каждого места работы.');
        return;
      }
      if (!await saveProfile({ experience })) return;
    }
    setProfileError('');
    setEditingExperience(value => !value);
  };

  const finishProjectsEditing = async () => {
    if (editingProjects) {
      if (projects.some(item => !item.name?.trim() || !item.desc?.trim() || !item.tech?.length)) {
        setProfileError('Для каждого проекта обязательны название, описание и стек технологий.');
        return;
      }
      if (!await saveProfile({ projects })) return;
    }
    setProfileError('');
    setEditingProjects(value => !value);
  };

  const finishAboutEditing = async () => {
    if (editingAbout && !await saveProfile({ about })) return;
    setProfileError('');
    setEditingAbout(value => !value);
  };

  const finishCityEditing = async () => {
    const value = city.trim();
    setCity(value);
    await saveProfile({ city: value });
    setEditingCity(false);
  };

  const finishSpecializationEditing = async () => {
    const value = specialization.trim();
    setSpecialization(value);
    await saveProfile({ specialization: value });
    setEditingSpecialization(false);
  };

  const downloadResume = async () => {
    try {
      const pdf = await api.downloadResume();
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a'); link.href = url; link.download = `resume-${(name || 'careerhub').replace(/\s+/g, '-')}.pdf`; link.click(); URL.revokeObjectURL(url);
    } catch {
      setProfileError('Не удалось сформировать PDF-резюме. Повторите попытку.');
    }
  };

  const initials = name
    ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'М';

  const toggleSkill = (skill) => {
    setMySkills(prev => {
      const newSkills = prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill];
      saveProfile({ skills: newSkills });
      return newSkills;
    });
  };

  const handleCustomSkillAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = newSkillText.trim();
      if (trimmed && !mySkills.includes(trimmed)) {
        setMySkills(prev => {
          const newSkills = [...prev, trimmed];
          saveProfile({ skills: newSkills });
          return newSkills;
        });
      }
      setNewSkillText('');
      setIsAddingSkill(false);
    } else if (e.key === 'Escape') {
      setNewSkillText('');
      setIsAddingSkill(false);
    }
  };





  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-slide-up space-y-6">
      {showOnboarding && <OnboardingModal user={user} updateUser={updateUser} onClose={() => {}} />}
      {profileError && <div className="alert-error text-sm">{profileError}</div>}
      {/* Hero card */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-surface-container to-surface-container-high relative">
          <div className="absolute bottom-0 left-6 translate-y-1/2">
            <label className="w-20 h-20 rounded-2xl bg-surface border-4 border-surface flex items-center justify-center text-2xl font-bold text-on-surface shadow-glass-lg select-none overflow-hidden cursor-pointer" style={{ background: '#18181b' }} title="Изменить аватар">
              {user?.avatar ? <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`} alt="Аватар" className="w-full h-full object-cover" /> : initials}
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </label>
          </div>
        </div>
        <div className="pt-14 pb-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">{name || 'Без имени'}</h1>
                {role === 'student' ? (
                  <span className="badge badge-indigo">Студент</span>
                ) : (
                  <span className="badge badge-outline">Соискатель</span>
                )}
                {user?.test_results && user.test_results.length > 0 ? (
                  <span className="badge badge-green">{user.test_results.sort((a,b)=>b.score-a.score)[0].level.toUpperCase()}</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                {role === 'student' && (
                  <>
                    <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" />МУИТ · 3 курс</span>
                    <span className="flex items-center gap-1.5"><span className="text-outline text-xs">GPA:</span><span className="font-semibold text-on-surface text-xs">3.3</span></span>
                  </>
                )}
                {editingCity ? (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <input
                      autoFocus
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      onBlur={finishCityEditing}
                      onKeyDown={e => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                        if (e.key === 'Escape') { setCity(user?.city || ''); setEditingCity(false); }
                      }}
                      className="bg-transparent border-b border-primary outline-none text-sm text-on-surface w-28"
                      placeholder="Город"
                      aria-label="Город"
                    />
                  </div>
                ) : (
                  <button type="button" onClick={() => setEditingCity(true)} className="flex items-center gap-1.5 hover:text-on-surface transition-colors" title="Изменить город">
                    <MapPin className="w-4 h-4" />{city || 'Город'}
                  </button>
                )}
              </div>
              <div className="mt-3">
                {editingSpecialization ? (
                  <input
                    autoFocus
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    onBlur={finishSpecializationEditing}
                    onKeyDown={e => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                      if (e.key === 'Escape') { setSpecialization(user?.specialization || ''); setEditingSpecialization(false); }
                    }}
                    className="bg-transparent border-b border-primary outline-none text-base font-medium text-on-surface w-full max-w-sm py-1"
                    placeholder="Например: Junior Python Developer"
                    aria-label="Специализация"
                  />
                ) : specialization ? (
                  <button type="button" onClick={() => setEditingSpecialization(true)} className="text-left text-base font-medium text-on-surface hover:text-primary transition-colors" title="Изменить специализацию">
                    {specialization}
                  </button>
                ) : (
                  <button type="button" onClick={() => setEditingSpecialization(true)} className="text-sm text-on-surface-variant hover:text-primary transition-colors">
                    + Добавить специализацию
                  </button>
                )}
              </div>
              <label className="flex items-center gap-2 mt-3 text-xs text-on-surface-variant cursor-pointer">
                <input type="checkbox" checked={contactSharing} onChange={e => { const value = e.target.checked; setContactSharing(value); saveProfile({ contact_sharing_enabled: value }); }} />
                Разрешить компаниям видеть мои контакты
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={downloadResume} className="btn-secondary text-xs py-2 px-3"><Download className="w-3.5 h-3.5" /> Скачать резюме</button>
              <label className="btn-secondary text-xs py-2 px-3 cursor-pointer"><Download className="w-3.5 h-3.5" /> Загрузить своё<input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={uploadResume} /></label>
              {role !== 'student' && <button onClick={onDelete} className="btn-secondary !text-error !border-error/20 hover:!bg-error/10 text-xs py-2 px-3">
                <Trash2 className="w-3.5 h-3.5" /> Удалить
              </button>}
            </div>
            {user?.resume_file && <div className="flex items-center gap-3 text-xs"><a href={user.resume_file.startsWith('http') ? user.resume_file : `http://localhost:8000${user.resume_file}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">Открыть загруженное резюме</a><button onClick={deleteUploadedResume} className="text-error hover:underline">Удалить своё резюме</button></div>}
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
              <button onClick={finishAboutEditing} className="btn-ghost py-1 px-2 text-xs gap-1">
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-on-surface-variant" /> Опыт работы
              </h2>
              <button onClick={finishExperienceEditing} className="btn-ghost py-1 px-2 text-xs gap-1">
                <Edit3 className="w-3 h-3" /> {editingExperience ? 'Готово' : 'Изменить'}
              </button>
            </div>
            {editingExperience ? (
              <div className="space-y-4">
                {experience.map((ex, i) => (
                  <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant space-y-3 relative">
                    <button 
                      onClick={() => {
                        const newExp = experience.filter((_, idx) => idx !== i);
                        setExperience(newExp);
                        saveProfile({ experience: newExp });
                      }}
                      className="absolute top-2 right-2 p-1 text-outline hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <input type="text" placeholder="Должность" value={ex.role} onChange={(e) => {
                      const newExp = [...experience];
                      newExp[i].role = e.target.value;
                      setExperience(newExp);
                    }} className="input-field w-full text-sm py-1.5" />
                    <input type="text" placeholder="Компания" value={ex.company} onChange={(e) => {
                      const newExp = [...experience];
                      newExp[i].company = e.target.value;
                      setExperience(newExp);
                    }} className="input-field w-full text-sm py-1.5" />
                    <div className="grid grid-cols-2 gap-2">
                    <input required type="date" aria-label="Дата начала" value={ex.start_date || ''} onChange={(e) => {
                      const newExp = [...experience];
                      newExp[i].start_date = e.target.value;
                      setExperience(newExp);
                    }} className="input-field w-full text-sm py-1.5" />
                    <input type="date" aria-label="Дата окончания" disabled={ex.is_current} value={ex.end_date || ''} onChange={(e) => { const newExp = [...experience]; newExp[i].end_date = e.target.value; setExperience(newExp); }} className="input-field w-full text-sm py-1.5" />
                    </div>
                    <label className="flex gap-2 text-xs text-on-surface-variant"><input type="checkbox" checked={Boolean(ex.is_current)} onChange={(e) => { const newExp = [...experience]; newExp[i].is_current = e.target.checked; if (e.target.checked) newExp[i].end_date = ''; setExperience(newExp); }} />По настоящее время</label>
                    <textarea placeholder="Описание" value={ex.desc} onChange={(e) => {
                      const newExp = [...experience];
                      newExp[i].desc = e.target.value;
                      setExperience(newExp);
                    }} className="input-field w-full text-sm py-1.5 resize-none" rows={2} />
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newExp = [...experience, { company: '', role: '', start_date: '', end_date: '', is_current: false, desc: '' }];
                    setExperience(newExp);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Добавить место работы
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {experience.length > 0 ? experience.map((ex, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface text-sm">{ex.role}</div>
                      <div className="text-xs text-on-surface-variant/80 mb-1">{ex.company} {ex.start_date ? `· ${ex.start_date}${ex.is_current ? ' — по настоящее время' : ex.end_date ? ` — ${ex.end_date}` : ''}` : ''}</div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{ex.desc}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-on-surface-variant italic">Опыт работы не указан.</p>
                )}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
                <Code2 className="w-4 h-4 text-on-surface-variant" /> Проекты
              </h2>
              <button onClick={finishProjectsEditing} className="btn-ghost py-1 px-2 text-xs gap-1">
                <Edit3 className="w-3 h-3" /> {editingProjects ? 'Готово' : 'Изменить'}
              </button>
            </div>
            {editingProjects ? (
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant space-y-3 relative">
                    <button 
                      onClick={() => {
                        const newProj = projects.filter((_, idx) => idx !== i);
                        setProjects(newProj);
                        saveProfile({ projects: newProj });
                      }}
                      className="absolute top-2 right-2 p-1 text-outline hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <input required type="text" placeholder="Название проекта" value={p.name} onChange={(e) => {
                      const newProj = [...projects];
                      newProj[i].name = e.target.value;
                      setProjects(newProj);
                    }} className="input-field w-full text-sm py-1.5" />
                    <textarea required placeholder="Описание проекта" value={p.desc} onChange={(e) => {
                      const newProj = [...projects];
                      newProj[i].desc = e.target.value;
                      setProjects(newProj);
                    }} className="input-field w-full text-sm py-1.5 resize-none" rows={2} />
                    <input required type="text" placeholder="Стек технологий (через запятую, например: React, Node.js)" value={p.tech.join(', ')} onChange={(e) => {
                      const newProj = [...projects];
                      newProj[i].tech = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setProjects(newProj);
                    }} className="input-field w-full text-sm py-1.5" />
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newProj = [...projects, { name: '', desc: '', tech: [] }];
                    setProjects(newProj);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Добавить проект
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((p, i) => (
                  <div key={i} className="p-4 bg-surface-container rounded-xl border border-outline-variant hover:border-outline transition-colors">
                    <div className="font-semibold text-on-surface text-sm mb-1">{p.name}</div>
                    <p className="text-xs text-on-surface-variant mb-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.map(t => <span key={t} className="skill-tag">{t}</span>)}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-on-surface-variant italic">Проекты не указаны.</p>
                )}
              </div>
            )}
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
            {role === 'student' ? (
              <>
                <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
                  <GraduationCap className="w-4 h-4 text-on-surface-variant" /> Образование
                </h2>
                {user?.university ? (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface text-sm">{user.university}</div>
                      <div className="text-xs text-on-surface-variant">Студент</div>
                      {user.student_id && <div className="text-xs text-outline">ID: {user.student_id}</div>}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-on-surface-variant italic">Университет не указан</div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-on-surface-variant" /> Образование
                  </h2>
                  <button onClick={() => {
                    if (editingEducation) {
                      if (jobseekerEducation.trim() && !diplomaFile && !user?.diploma_file) {
                        alert('Пожалуйста, прикрепите диплом (файл), чтобы подтвердить образование. Иначе будет указано "Без высшего образования".');
                        return;
                      }
                      const formData = new FormData();
                      formData.append('education_info', jobseekerEducation);
                      if (diplomaFile) {
                        formData.append('diploma_file', diplomaFile);
                      }
                      saveProfile(formData);
                    }
                    setEditingEducation(v => !v);
                  }} className="btn-ghost py-1 px-2 text-xs gap-1">
                    <Edit3 className="w-3 h-3" /> {editingEducation ? 'Сохранить' : 'Изменить'}
                  </button>
                </div>
                {editingEducation ? (
                  <div className="space-y-3">
                    <textarea
                      className="input-field resize-none text-sm leading-relaxed w-full"
                      rows={3}
                      placeholder="Расскажите о своем образовании..."
                      value={jobseekerEducation}
                      onChange={e => setJobseekerEducation(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => setDiplomaFile(e.target.files[0])} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="btn-secondary py-1.5 px-3 text-xs"
                      >
                        Прикрепить диплом
                      </button>
                      <span className="text-xs text-on-surface-variant truncate max-w-[200px]">
                        {diplomaFile ? diplomaFile.name : (user?.diploma_file ? 'Диплом загружен' : 'Файл не выбран')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {jobseekerEducation.trim() ? jobseekerEducation : 'Без высшего образования'}
                      </p>
                      {user?.diploma_file && (
                        <a href={user.diploma_file} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                          Смотреть диплом
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Test Results */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-on-surface-variant" /> Результаты тестов
            </h2>
            <div className="space-y-3">
              {(user?.test_results || []).length > 0 ? (user?.test_results || []).map((t, i) => (
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
              )) : (
                <p className="text-sm text-on-surface-variant italic">Вы еще не прошли ни одного теста на платформе.</p>
              )}
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
                <span className="truncate">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.github_url && (
                <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <a href={user.github_url} target="_blank" rel="noreferrer">{user.github_url.replace(/^https?:\/\//, '')}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Company Profile ──────────────────────────────────────────────────────────
function CompanyProfile({ name, onDelete, user, updateUser }) {
  const [openVacancies, setOpenVacancies] = useState([]);
  const [hiringStats, setHiringStats] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [companyForm, setCompanyForm] = useState(() => ({
    name: name || '', about: user?.about || '', city: user?.city || '', industry: user?.industry || '',
    company_size: user?.company_size || '', website: user?.website || '', phone: user?.phone || '',
  }));
  const navigate = useNavigate();
  useEffect(() => { api.myVacancies().then(items => setOpenVacancies(items.filter(item => item.is_active))).catch(console.error); api.companyHiringStats().then(setHiringStats).catch(console.error); }, []);
  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    const updated = await api.updateProfile(formData);
    updateUser?.(updated);
  };
  const saveCompanyProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await api.updateProfile({ ...companyForm, first_name: companyForm.name.trim(), last_name: '' });
      updateUser?.(updated);
      setEditingProfile(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const formatLabel = { Remote: 'Удалённо', Hybrid: 'Гибрид', Office: 'В офисе' };
  const levelVariant = { Junior: 'badge-green', Middle: 'badge-indigo', Senior: 'badge-amber' };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-slide-up space-y-6">
      {/* Hero */}
      <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-surface-container to-surface-container-high" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <label className="w-20 h-20 rounded-2xl bg-surface-container border-4 border-surface flex items-center justify-center text-2xl font-bold text-on-surface shadow-glass overflow-hidden cursor-pointer" style={{ borderColor: '#09090b' }} title="Изменить аватар">
              {user?.avatar ? <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`} alt="Аватар компании" className="w-full h-full object-cover" /> : (name ? name[0] : 'K')}
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold text-on-surface tracking-tight">{name || 'Kaspi.kz'}</h1>
                {user?.industry && <span className="badge badge-indigo">{user.industry}</span>}
              </div>
              <p className="text-sm text-on-surface-variant">{user?.about || 'Добавьте описание компании, чтобы кандидаты лучше понимали вашу деятельность.'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {user?.website && <a href={user.website} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3"><ExternalLink className="w-3.5 h-3.5" /> Сайт</a>}
              <button onClick={onDelete} className="btn-secondary !text-error !border-error/20 hover:!bg-error/10 text-xs py-2 px-3">
                <Trash2 className="w-3.5 h-3.5" /> Удалить
              </button>
              <button onClick={() => setEditingProfile(value => !value)} className="btn-primary text-xs py-2 px-3">
                <Edit3 className="w-3.5 h-3.5" /> Редактировать
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingProfile && (
        <form onSubmit={saveCompanyProfile} className="glass-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 flex items-center justify-between"><h2 className="text-base font-semibold text-on-surface">Редактирование профиля компании</h2><button type="button" onClick={() => setEditingProfile(false)} className="btn-ghost text-xs">Отмена</button></div>
          {[
            ['name', 'Название компании', 'text'], ['industry', 'Индустрия', 'text'], ['city', 'Город', 'text'],
            ['company_size', 'Размер команды', 'text'], ['website', 'Сайт компании', 'url'], ['phone', 'Телефон', 'tel'],
          ].map(([field, label, type]) => <label key={field} className="text-sm text-on-surface space-y-1"><span>{label}</span><input required={field === 'name'} type={type} value={companyForm[field]} onChange={e => setCompanyForm(prev => ({ ...prev, [field]: e.target.value }))} className="input-field w-full" /></label>)}
          <label className="sm:col-span-2 text-sm text-on-surface space-y-1"><span>Описание компании</span><textarea value={companyForm.about} onChange={e => setCompanyForm(prev => ({ ...prev, about: e.target.value }))} className="input-field w-full min-h-24" /></label>
          <div className="sm:col-span-2 flex justify-end"><button disabled={savingProfile} className="btn-primary">{savingProfile ? 'Сохранение…' : 'Сохранить'}</button></div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info grid */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-on-surface mb-4">Информация о компании</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Building2, label: 'Индустрия', value: user?.industry || 'Не указана' },
                { icon: MapPin, label: 'Локация', value: user?.city || 'Не указана' },
                { icon: Globe, label: 'Сайт', value: user?.website?.replace(/^https?:\/\//, '') || 'Не указан' },
                { icon: Users, label: 'Сотрудников', value: user?.company_size || 'Не указано' },
                { icon: Briefcase, label: 'Открытых вакансий', value: String(openVacancies.length) },
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
                      <span className="badge badge-outline">{v.type}</span>
                      <span className="font-medium text-on-surface">{v.salary}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/vacancies')} className="btn-ghost py-1.5 px-3 text-xs flex-shrink-0">
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
                { label: 'Активных вакансий', value: hiringStats?.active_vacancies ?? '—' },
                { label: 'Пассивных вакансий', value: hiringStats?.passive_vacancies ?? '—' },
                { label: 'Просмотров вакансий', value: hiringStats?.vacancy_views ?? '—' },
                { label: 'Откликов', value: hiringStats?.applications ?? '—' },
                { label: 'Наймов', value: hiringStats?.hired ?? '—' },
                { label: 'Конверсия', value: hiringStats ? `${hiringStats.conversion_percent}%` : '—' },
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
  const { user, isCompany, deleteProfile, updateUser } = useAuth();
  const name = user?.name || 'Мансур';
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить профиль? Это действие нельзя отменить.')) {
      await deleteProfile();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {isCompany ? <CompanyProfile name={name} onDelete={handleDelete} user={user} updateUser={updateUser} /> : <StudentProfile name={name} role={user?.role} onDelete={handleDelete} user={user} updateUser={updateUser} />}
      <ChatWidget />
    </div>
  );
}
