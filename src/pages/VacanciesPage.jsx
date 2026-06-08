import { useState, useEffect } from 'react';
import { Briefcase, Plus, MapPin, DollarSign, Clock, Search, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import AppNavbar from '../components/AppNavbar';
import { api } from '../api/client';

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    salary: '',
    type: 'Полная занятость',
    description: '',
    requirements: '',
  });

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setIsLoading(true);
      const data = await api.myVacancies();
      setVacancies(data);
    } catch (error) {
      console.error('Ошибка при загрузке вакансий', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '', department: '', location: '', salary: '', type: 'Полная занятость', description: '', requirements: '',
    });
    setStep(1);
    setIsModalOpen(true);
  };

  const openEditModal = (vacancy) => {
    setEditingId(vacancy.id);
    setFormData({
      title: vacancy.title || '',
      department: vacancy.department || '',
      location: vacancy.location || '',
      salary: vacancy.salary || '',
      type: vacancy.type || 'Полная занятость',
      description: vacancy.description || '',
      requirements: vacancy.requirements ? vacancy.requirements.join('\n') : '',
    });
    setStep(1);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim() !== '')
      };

      if (editingId) {
        const updatedVacancy = await api.updateVacancy(editingId, payload);
        setVacancies(prev => prev.map(v => v.id === editingId ? updatedVacancy : v));
      } else {
        const newVacancy = await api.createVacancy(payload);
        setVacancies(prev => [newVacancy, ...prev]);
      }
      setIsModalOpen(false);
      setStep(1);
      setFormData({
        title: '',
        department: '',
        location: '',
        salary: '',
        type: 'Полная занятость',
        description: '',
        requirements: '',
      });
    } catch (error) {
      console.error('Ошибка при создании вакансии', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <PageHeader
            icon={Briefcase}
            eyebrow="Управление"
            title="Мои вакансии"
            subtitle="Создавайте и управляйте вакансиями вашей компании."
          />
          <button
            onClick={openCreateModal}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать вакансию
          </button>
        </div>

        {isLoading ? (
          <LoadingState text="Загрузка вакансий..." />
        ) : vacancies.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="У вас пока нет вакансий"
            description="Создайте первую вакансию, чтобы начать поиск талантов."
            action={{
              label: "Создать вакансию",
              onClick: openCreateModal
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="card p-6 flex flex-col group hover:border-primary/30 transition-colors">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-on-surface line-clamp-2">{vacancy.title}</h3>
                    <Badge variant="indigo" className="whitespace-nowrap">{vacancy.type}</Badge>
                  </div>
                  
                  {vacancy.department && (
                    <p className="text-sm text-on-surface-variant mb-4">{vacancy.department}</p>
                  )}

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-on-surface-variant">
                      <MapPin className="w-4 h-4 mr-2 text-outline" />
                      {vacancy.location}
                    </div>
                    {vacancy.salary && (
                      <div className="flex items-center text-sm text-on-surface-variant">
                        <DollarSign className="w-4 h-4 mr-2 text-outline" />
                        {vacancy.salary}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-on-surface-variant">
                      <Clock className="w-4 h-4 mr-2 text-outline" />
                      {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="text-sm font-medium text-primary">Активна</span>
                  <button onClick={() => openEditModal(vacancy)} className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Редактировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-full">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
              <h2 className="text-xl font-bold text-on-surface">
                {editingId ? 'Редактировать вакансию' : 'Создать вакансию'}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); setStep(1); }}
                className="p-2 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="vacancy-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {step === 1 && (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-on-surface">Название должности *</label>
                        <input
                          required
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Например: Senior Frontend Developer"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Отдел</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Например: Инженерия"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Локация *</label>
                        <input
                          required
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Например: Алматы, Казахстан (или Удаленно)"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Зарплата</label>
                        <input
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Например: от 500 000 ₸"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-on-surface">Тип занятости *</label>
                        <select
                          required
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="Полная занятость">Полная занятость</option>
                          <option value="Частичная занятость">Частичная занятость</option>
                          <option value="Стажировка">Стажировка</option>
                          <option value="Проектная работа">Проектная работа</option>
                        </select>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-on-surface">Описание вакансии *</label>
                      <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field min-h-[120px] resize-y"
                        placeholder="Опишите задачи и условия работы..."
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-on-surface">Требования (каждое с новой строки) *</label>
                      <textarea
                        required
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        className="input-field min-h-[120px] resize-y"
                        placeholder="Опыт работы от 3 лет&#10;Знание React и TailwindCSS&#10;Умение работать в команде..."
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-outline-variant/30 flex justify-between gap-3 bg-surface-container-lowest">
              <button
                type="button"
                onClick={() => {
                  if (step === 1) {
                    setIsModalOpen(false);
                    setStep(1);
                  } else {
                    setStep(s => s - 1);
                  }
                }}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                {step === 1 ? 'Отмена' : 'Назад'}
              </button>
              <button
                type="submit"
                form="vacancy-form"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {step < 3 ? 'Далее' : (isSubmitting ? 'Сохранение...' : (editingId ? 'Сохранить изменения' : 'Опубликовать вакансию'))}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
