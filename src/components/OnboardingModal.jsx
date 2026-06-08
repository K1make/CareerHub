import { useState } from 'react';
import { Phone, Globe, X } from 'lucide-react';
import { api } from '../api/client';

export default function OnboardingModal({ user, updateUser, onClose }) {
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!phone.trim()) {
      setError('Номер телефона обязателен');
      return;
    }
    setSaving(true);
    try {
      const data = await api.updateProfile({ phone: phone.trim(), github_url: github.trim() || null, profile_completed: true });
      if (updateUser && data) updateUser(data);
      onClose();
    } catch (e) {
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-outline-variant rounded-2xl p-8 w-full max-w-md mx-4 shadow-glass-lg animate-slide-up">
        <h2 className="text-xl font-bold text-on-surface mb-2">Добро пожаловать! 🎉</h2>
        <p className="text-sm text-on-surface-variant mb-6">Заполните контактные данные, чтобы работодатели могли с вами связаться.</p>

        {error && <div className="text-xs text-error mb-4 p-2 bg-error/10 rounded-lg">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              Номер телефона <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="tel"
                placeholder="+7 (7XX) XXX-XX-XX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              Ссылка на GitHub <span className="text-on-surface-variant">(необязательно)</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="url"
                placeholder="https://github.com/username"
                value={github}
                onChange={e => setGithub(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full mt-6 py-2.5"
        >
          {saving ? 'Сохранение...' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
}
