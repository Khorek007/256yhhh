// src/components/Profile.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ==================== ТИПЫ ====================
type UserRole = 'child' | 'parent' | 'psychologist' | 'admin';
type ProfileTab = 'info' | 'children' | 'sessions' | 'documents' | 'settings' | 'activity';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
  bio: string;
  organization?: string;
}

interface ChildProfile {
  id: string;
  fullName: string;
  age: number;
  birthDate: string;
  status: 'active' | 'inactive';
  parentId: string;
}

interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  specialist: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'personal' | 'chat';
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

interface ActivityLog {
  id: string;
  action: string;
  date: string;
  time: string;
  device: string;
}

// ==================== КОМПОНЕНТ ПРОФИЛЯ ====================
const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Mock пользователь (в реальном приложении берется из auth context)
  const [userProfile] = useState<UserProfile>({
    id: '1',
    username: 'ivan_ivanov',
    fullName: 'Иванов Иван Петрович',
    email: 'ivan@example.com',
    role: 'psychologist',
    phone: '+79991234567',
    avatar: 'II',
    createdAt: '2025-01-15',
    lastLogin: '2025-11-09 13:45:00',
    bio: 'Практикующий психолог с опытом работы в сфере детской психологии',
    organization: 'ГКУ ЦПРК Иркутской области',
  });

  // Mock дети (для родителя)
  const [children] = useState<ChildProfile[]>([
    {
      id: '1',
      fullName: 'Петров Петр Иванович',
      age: 8,
      birthDate: '2017-05-15',
      status: 'active',
      parentId: '1',
    },
    {
      id: '2',
      fullName: 'Петрова Мария Ивановна',
      age: 11,
      birthDate: '2014-03-20',
      status: 'active',
      parentId: '1',
    },
  ]);

  // Mock консультации
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Видеоконсультация',
      date: '2025-11-12',
      time: '14:00',
      specialist: 'Сидорова Анна Ивановна',
      status: 'upcoming',
      type: 'video',
    },
    {
      id: '2',
      title: 'Очная консультация',
      date: '2025-11-05',
      time: '10:30',
      specialist: 'Смирнов Иван Алексеевич',
      status: 'completed',
      type: 'personal',
    },
    {
      id: '3',
      title: 'Консультация в чате',
      date: '2025-11-01',
      time: '16:15',
      specialist: 'Козлова Ольга Сергеевна',
      status: 'completed',
      type: 'chat',
    },
  ]);

  // Mock документы
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Заключение психолога 2025.pdf',
      type: 'PDF',
      uploadedAt: '2025-11-01',
      size: '2.3 MB',
    },
    {
      id: '2',
      name: 'Результаты тестирования.pdf',
      type: 'PDF',
      uploadedAt: '2025-10-25',
      size: '1.8 MB',
    },
    {
      id: '3',
      name: 'История консультаций.xlsx',
      type: 'XLSX',
      uploadedAt: '2025-10-20',
      size: '0.9 MB',
    },
  ]);

  // Mock логи активности
  const [activityLog] = useState<ActivityLog[]>([
    {
      id: '1',
      action: 'Вход в систему',
      date: '2025-11-09',
      time: '13:45',
      device: 'Chrome на Windows',
    },
    {
      id: '2',
      action: 'Загрузка документа',
      date: '2025-11-08',
      time: '11:20',
      device: 'Safari на MacOS',
    },
    {
      id: '3',
      action: 'Редактирование профиля',
      date: '2025-11-07',
      time: '09:15',
      device: 'Chrome на Windows',
    },
    {
      id: '4',
      action: 'Завершение консультации',
      date: '2025-11-05',
      time: '15:00',
      device: 'Chrome на Windows',
    },
  ]);

  // Состояния
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  // ==================== ОБРАБОТЧИКИ ====================

  /**
   * Сохранение изменений профиля
   */
  const handleSaveProfile = () => {
    // Здесь должен быть API запрос на сохранение
    setIsEditing(false);
  };

  /**
   * Выход из системы
   */
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  /**
   * Получение роли на русском
   */
  const getRoleLabel = (role: UserRole): string => {
    const labels = {
      child: 'Ребёнок',
      parent: 'Родитель',
      psychologist: 'Психолог',
      admin: 'Администратор',
    };
    return labels[role];
  };

  /**
   * Получение статуса на русском
   */
  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      upcoming: 'Предстоящая',
      completed: 'Завершённая',
      cancelled: 'Отменённая',
      active: 'Активный',
      inactive: 'Неактивный',
    };
    return labels[status] || status;
  };

  /**
   * Получение цвета статуса
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Получение типа консультации на русском
   */
  const getSessionTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      video: 'Видеоконсультация',
      personal: 'Очная консультация',
      chat: 'Чат консультация',
    };
    return labels[type] || type;
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* ЛЕВАЯ ПАНЕЛЬ - ПРОФИЛЬ И МЕНЮ */}
          <div className="md:col-span-1">
            {/* КАРТОЧКА ПРОФИЛЯ */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <span className="text-3xl font-bold text-white">{userProfile.avatar}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{userProfile.fullName}</h2>
                <p className="text-sm text-gray-500">@{userProfile.username}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                  {getRoleLabel(userProfile.role)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 py-4 border-t border-b border-gray-200">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {userProfile.email}
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {userProfile.phone}
                </p>
              </div>

              <div className="mt-4 pt-4 text-xs text-gray-500 space-y-1">
                <p>Создан: {userProfile.createdAt}</p>
                <p>Последний вход: {userProfile.lastLogin}</p>
              </div>
            </div>

            {/* МЕНЮ НАВИГАЦИИ */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'info'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Профиль</span>
              </button>

              {(userProfile.role === 'parent' || userProfile.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('children')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                    activeTab === 'children'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Мои дети</span>
                </button>
              )}

              {(userProfile.role === 'psychologist' || userProfile.role === 'child' || userProfile.role === 'parent') && (
                <button
                  onClick={() => setActiveTab('sessions')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                    activeTab === 'sessions'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Консультации</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'documents'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Документы</span>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'activity'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>История</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                  activeTab === 'settings'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Настройки</span>
              </button>
            </nav>
          </div>

          {/* ПРАВАЯ ПАНЕЛЬ - ОСНОВНОЙ КОНТЕНТ */}
          <div className="md:col-span-3">
            {/* ==================== ВКЛ. ПРОФИЛЬ ==================== */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Информация профиля</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{isEditing ? 'Отмена' : 'Редактировать'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Полное имя</label>
                      <input
                        type="text"
                        value={editedProfile.fullName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Логин</label>
                      <input
                        type="text"
                        value={editedProfile.username}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Телефон</label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">О себе</label>
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  {userProfile.organization && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Организация</label>
                      <input
                        type="text"
                        value={editedProfile.organization}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Совет:</strong> Используйте актуальную информацию для лучшей коммуникации с другими пользователями системы.
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Сохранить изменения
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedProfile(userProfile);
                        }}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Отмена
                      </button>
                    </div>
                  )}
                </div>

                {/* Кнопка смены пароля */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Изменить пароль</span>
                  </button>
                </div>
              </div>
            )}

            {/* ==================== ВКЛ. МОИ ДЕТИ ==================== */}
            {activeTab === 'children' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Мои дети</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div key={child.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{child.fullName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Возраст: <span className="font-medium">{child.age} лет</span> • Дата рождения: <span className="font-medium">{child.birthDate}</span>
                            </p>
                            <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(child.status)}`}>
                              {getStatusLabel(child.status)}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedChild(child)}
                            className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            Подробнее
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {children.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 font-medium">Нет добавленных детей</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== ВКЛ. КОНСУЛЬТАЦИИ ==================== */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                {/* Предстоящие */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Предстоящие консультации</h2>
                  </div>

                  <div className="p-6">
                    {sessions.filter(s => s.status === 'upcoming').length > 0 ? (
                      <div className="space-y-4">
                        {sessions
                          .filter(s => s.status === 'upcoming')
                          .map((session) => (
                            <div key={session.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{session.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {session.date} в {session.time}
                                  </p>
                                  <p className="text-sm text-gray-600">Специалист: {session.specialist}</p>
                                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                                    {getStatusLabel(session.status)}
                                  </span>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                  Подключиться
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Нет предстоящих консультаций</p>
                    )}
                  </div>
                </div>

                {/* История */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">История консультаций</h2>
                  </div>

                  <div className="p-6">
                    {sessions.filter(s => s.status === 'completed').length > 0 ? (
                      <div className="space-y-4">
                        {sessions
                          .filter(s => s.status === 'completed')
                          .map((session) => (
                            <div key={session.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{session.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {session.date} в {session.time}
                                  </p>
                                  <p className="text-sm text-gray-600">Специалист: {session.specialist}</p>
                                  <p className="text-xs text-gray-500 mt-1">{getSessionTypeLabel(session.type)}</p>
                                </div>
                                <button className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm">
                                  Скачать отчет
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Нет завершённых консультаций</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ВКЛ. ДОКУМЕНТЫ ==================== */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Документы</h2>
                    <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Загрузить</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {documents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Название</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Тип</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Размер</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Загружено</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                  </svg>
                                  <span className="font-medium text-gray-900">{doc.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{doc.type}</td>
                              <td className="px-4 py-3 text-gray-600">{doc.size}</td>
                              <td className="px-4 py-3 text-gray-600">{doc.uploadedAt}</td>
                              <td className="px-4 py-3 text-right space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">Скачать</button>
                                <button className="text-red-600 hover:text-red-700 font-medium text-xs">Удалить</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Документы отсутствуют</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== ВКЛ. ИСТОРИЯ АКТИВНОСТИ ==================== */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">История активности</h2>
                </div>

                <div className="p-6">
                  {activityLog.length > 0 ? (
                    <div className="space-y-4">
                      {activityLog.map((log, index) => (
                        <div key={log.id} className="flex">
                          <div className="flex flex-col items-center mr-4">
                            <div className="w-4 h-4 bg-blue-600 rounded-full mt-1.5"></div>
                            {index !== activityLog.length - 1 && <div className="w-0.5 h-12 bg-gray-300 my-1"></div>}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="font-semibold text-gray-900">{log.action}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {log.date} в {log.time}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Устройство: {log.device}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">Нет истории активности</p>
                  )}
                </div>
              </div>
            )}

            {/* ==================== ВКЛ. НАСТРОЙКИ ==================== */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Уведомления */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Уведомления</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">Уведомления по email</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">Уведомления о консультациях</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                      <span className="ml-3 text-gray-700">Рассылка новостей</span>
                    </label>
                  </div>
                </div>

                {/* Конфиденциальность */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Опасные действия</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <button className="w-full px-6 py-3 bg-yellow-100 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-200 transition-colors duration-200">
                      Скачать мои данные
                    </button>
                    <button className="w-full px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors duration-200">
                      Удалить аккаунт
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ==================== МОДАЛЬНЫЕ ОКНА ==================== */}

      {/* Подтверждение выхода */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <h3 className="text-lg font-bold text-red-900">Вы уверены?</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Вы действительно хотите выйти из системы?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Отмена
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Выход
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
