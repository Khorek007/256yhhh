// src/components/AdminPanel.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ==================== ТИПЫ ====================
type UserRole = 'child' | 'parent' | 'psychologist' | 'admin';
type PermissionLevel = 'deny' | 'read' | 'write' | 'full';
type SystemModule = 
  | 'testing'
  | 'video_consultations'
  | 'documents'
  | 'chat'
  | 'analytics'
  | 'admin_panel'
  | 'profile';

interface ModulePermission {
  module: SystemModule;
  level: PermissionLevel;
}

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string | null;
  permissions: ModulePermission[];
  isActive: boolean;
}

interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

interface NewUserForm {
  fullName: string;
  email: string;
  role: UserRole;
  grantAllPermissions: boolean;
}

// ==================== УТИЛИТЫ ====================
const generateUsername = (fullName: string): string => {
  const translitMap: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': '_'
  };

  return fullName
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 20);
};

const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// ==================== КОМПОНЕНТ АДМИН-ПАНЕЛИ ====================
const AdminPanel: React.FC = () => {
  // Mock данные пользователей
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'ivanov_ivan',
      fullName: 'Иванов Иван Петрович',
      email: 'ivanov@example.com',
      role: 'psychologist',
      createdAt: '2025-01-15',
      lastLogin: '2025-10-27 14:30',
      isActive: true,
      permissions: [
        { module: 'testing', level: 'full' },
        { module: 'video_consultations', level: 'full' },
        { module: 'documents', level: 'write' },
        { module: 'chat', level: 'full' },
        { module: 'profile', level: 'full' },
      ],
    },
    {
      id: '2',
      username: 'petrov_petr',
      fullName: 'Петров Петр Сидорович',
      email: 'petrov@example.com',
      role: 'child',
      createdAt: '2025-02-20',
      lastLogin: '2025-10-26 10:15',
      isActive: true,
      permissions: [
        { module: 'testing', level: 'write' },
        { module: 'video_consultations', level: 'write' },
        { module: 'profile', level: 'read' },
      ],
    },
    {
      id: '3',
      username: 'sidorova_anna',
      fullName: 'Сидорова Анна Ивановна',
      email: 'sidorova@example.com',
      role: 'parent',
      createdAt: '2025-03-10',
      lastLogin: null,
      isActive: true,
      permissions: [
        { module: 'video_consultations', level: 'write' },
        { module: 'profile', level: 'full' },
      ],
    },
  ]);

  // Mock логи активности
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      userId: '1',
      username: 'ivanov_ivan',
      action: 'Вход в систему',
      module: 'Авторизация',
      timestamp: '2025-10-27 14:30:15',
      ipAddress: '192.168.1.100',
      details: 'Успешная авторизация',
    },
    {
      id: '2',
      userId: '2',
      username: 'petrov_petr',
      action: 'Прохождение теста',
      module: 'Тестирование',
      timestamp: '2025-10-26 10:15:42',
      ipAddress: '192.168.1.105',
      details: 'Завершен тест "Психологическая оценка"',
    },
    {
      id: '3',
      userId: '1',
      username: 'ivanov_ivan',
      action: 'Загрузка документа',
      module: 'Документооборот',
      timestamp: '2025-10-25 16:20:30',
      ipAddress: '192.168.1.100',
      details: 'Загружен файл report_2025.pdf',
    },
    {
      id: '4',
      userId: '2',
      username: 'petrov_petr',
      action: 'Подключение к видеоконсультации',
      module: 'Видеоконсультации',
      timestamp: '2025-10-24 11:00:00',
      ipAddress: '192.168.1.105',
      details: 'Комната #12345',
    },
    {
      id: '5',
      userId: '3',
      username: 'sidorova_anna',
      action: 'Регистрация',
      module: 'Авторизация',
      timestamp: '2025-10-23 09:00:00',
      ipAddress: '192.168.1.110',
      details: 'Новая учетная запись',
    },
  ]);

  // Состояния
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [newUserData, setNewUserData] = useState<NewUserForm>({
    fullName: '',
    email: '',
    role: 'child',
    grantAllPermissions: false,
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

  // Все доступные модули системы
  const allModules: { module: SystemModule; label: string }[] = [
    { module: 'testing', label: 'Тестирование' },
    { module: 'video_consultations', label: 'Видеоконсультации' },
    { module: 'documents', label: 'Документооборот' },
    { module: 'chat', label: 'Чат психологов' },
    { module: 'analytics', label: 'Аналитика и отчетность' },
    { module: 'admin_panel', label: 'Панель администратора' },
    { module: 'profile', label: 'Личный кабинет' },
  ];

  // Фильтрация пользователей
  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user =>
          user.fullName.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }

    return result;
  }, [users, searchQuery, filterRole]);

  // Получение уровня доступа
  const getPermissionLevel = (user: User, module: SystemModule): PermissionLevel => {
    const permission = user.permissions.find(p => p.module === module);
    return permission?.level || 'deny';
  };

  // Обновление разрешения
  const updatePermission = (userId: string, module: SystemModule, level: PermissionLevel) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id !== userId) return user;

        const existingPermissionIndex = user.permissions.findIndex(p => p.module === module);
        let newPermissions = [...user.permissions];

        if (level === 'deny') {
          newPermissions = newPermissions.filter(p => p.module !== module);
        } else if (existingPermissionIndex >= 0) {
          newPermissions[existingPermissionIndex] = { module, level };
        } else {
          newPermissions.push({ module, level });
        }

        return { ...user, permissions: newPermissions };
      })
    );
  };

  // Добавление пользователя
  const handleAddUser = () => {
    if (!newUserData.fullName || !newUserData.email) {
      alert('Заполните все обязательные поля');
      return;
    }

    const username = generateUsername(newUserData.fullName);
    const tempPassword = generateTempPassword();

    let permissions: ModulePermission[] = [];
    if (newUserData.grantAllPermissions) {
      permissions = allModules.map(m => ({ module: m.module, level: 'full' as PermissionLevel }));
    } else {
      const basePermissions: { [key in UserRole]: SystemModule[] } = {
        child: ['testing', 'video_consultations', 'profile'],
        parent: ['video_consultations', 'profile'],
        psychologist: ['testing', 'video_consultations', 'documents', 'chat', 'profile'],
        admin: ['testing', 'video_consultations', 'documents', 'chat', 'analytics', 'admin_panel', 'profile'],
      };

      permissions = basePermissions[newUserData.role].map(module => ({
        module,
        level: newUserData.role === 'admin' ? 'full' : 'write',
      }));
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      fullName: newUserData.fullName,
      email: newUserData.email,
      role: newUserData.role,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null,
      isActive: true,
      permissions,
    };

    setUsers(prev => [...prev, newUser]);
    setGeneratedCredentials({ username, password: tempPassword });
    setShowAddUserModal(false);
    setShowCredentialsModal(true);

    setNewUserData({
      fullName: '',
      email: '',
      role: 'child',
      grantAllPermissions: false,
    });
  };

  // Удаление пользователя
  const handleDeleteUser = (userId: string) => {
    if (confirm('Вы уверены? Это действие необратимо!')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      setShowUserModal(false);
      setSelectedUser(null);
    }
  };

  // Переключение активности
  const toggleUserActive = (userId: string) => {
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, isActive: !user.isActive } : user))
    );
  };

  // Копирование в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена!');
  };

  // Цвет разрешения
  const getPermissionColor = (level: PermissionLevel): string => {
    switch (level) {
      case 'full':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'write':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'read':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'deny':
        return 'bg-red-100 text-red-800 border border-red-300';
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    const labels = {
      child: 'Ребёнок',
      parent: 'Родитель',
      psychologist: 'Психолог',
      admin: 'Администратор',
    };
    return labels[role];
  };

  const getPermissionLabel = (level: PermissionLevel): string => {
    const labels = {
      deny: 'Запретить',
      read: 'Чтение',
      write: 'Изменение',
      full: 'Полный доступ',
    };
    return labels[level];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
              <p className="text-sm text-gray-600 mt-1">Управление пользователями и правами доступа</p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>На главную</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TABS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>Пользователи ({users.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === 'logs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Логи ({activityLogs.length})</span>
              </button>
            </nav>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">
            {activeTab === 'users' ? (
              <>
                {/* ACTIONS PANEL */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Поиск по имени, логину или email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <select
                    value={filterRole}
                    onChange={e => setFilterRole(e.target.value as UserRole | 'all')}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium"
                  >
                    <option value="all">Все роли</option>
                    <option value="child">Ребёнок</option>
                    <option value="parent">Родитель</option>
                    <option value="psychologist">Психолог</option>
                    <option value="admin">Администратор</option>
                  </select>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Добавить</span>
                  </button>
                </div>

                {/* USERS TABLE */}
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Пользователь
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Роль
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Последний вход
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Статус
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {user.fullName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                                  <div className="text-xs text-gray-500">@{user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {user.lastLogin || <span className="text-gray-400 italic">Не входил</span>}
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => toggleUserActive(user.id)}
                                className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                  user.isActive
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span>{user.isActive ? 'Активен' : 'Заблокирован'}</span>
                              </button>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                              >
                                Права →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 font-medium">Пользователи не найдены</p>
                  </div>
                )}
              </>
            ) : (
              /* LOGS TAB */
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Логи активности</h3>
                  <button
                    onClick={() => setShowLogsModal(true)}
                    className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900"
                  >
                    Все логи
                  </button>
                </div>

                {activityLogs.slice(0, 10).map(log => (
                  <div
                    key={log.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">@{log.username}</span>
                          <span className="text-xs text-gray-500">{log.timestamp}</span>
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                            {log.module}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-1">{log.action}</p>
                        <p className="text-xs text-gray-600">{log.details}</p>
                      </div>
                      <div className="text-xs text-gray-400">{log.ipAddress}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ==================== МОДАЛЬНЫЕ ОКНА ==================== */}

      {/* 1. УПРАВЛЕНИЕ ПРАВАМИ */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b">
              <div>
                <h2 className="text-xl font-bold text-white">Управление правами доступа</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedUser.fullName} (@{selectedUser.username})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="text-blue-200 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ИНФОРМАЦИЯ */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Логин</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Роль</p>
                    <p className="text-sm font-medium text-gray-900">{getRoleLabel(selectedUser.role)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Создан</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUser.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Статус</p>
                    <p className={`text-sm font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser.isActive ? 'Активен' : 'Заблокирован'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ТАБЛИЦА РАЗРЕШЕНИЙ */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Разрешения по модулям</h3>
                <div className="space-y-3">
                  {allModules.map(({ module, label }) => (
                    <div key={module} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Текущее: <span className="font-medium">{getPermissionLabel(getPermissionLevel(selectedUser, module))}</span>
                          </p>
                        </div>
                        <select
                          value={getPermissionLevel(selectedUser, module)}
                          onChange={e =>
                            updatePermission(selectedUser.id, module, e.target.value as PermissionLevel)
                          }
                          className={`px-3 py-2 text-sm font-semibold rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPermissionColor(getPermissionLevel(selectedUser, module))}`}
                        >
                          <option value="deny">Запретить</option>
                          <option value="read">Чтение</option>
                          <option value="write">Изменение</option>
                          <option value="full">Полный доступ</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* БЫСТРЫЕ ДЕЙСТВИЯ */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Быстрые действия</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      allModules.forEach(({ module }) => {
                        updatePermission(selectedUser.id, module, 'full');
                      });
                    }}
                    className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-md hover:bg-green-200"
                  >
                    Дать все права
                  </button>
                  <button
                    onClick={() => {
                      allModules.forEach(({ module }) => {
                        updatePermission(selectedUser.id, module, 'deny');
                      });
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200"
                  >
                    Запретить все
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 ml-auto"
                  >
                    Удалить пользователя
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold text-white">Добавить пользователя</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-blue-200 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Полное имя *
                </label>
                <input
                  type="text"
                  value={newUserData.fullName}
                  onChange={e => setNewUserData({ ...newUserData, fullName: e.target.value })}
                  placeholder="Например: Иванов Иван Петрович"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Роль
                </label>
                <select
                  value={newUserData.role}
                  onChange={e => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="child">Ребёнок</option>
                  <option value="parent">Родитель</option>
                  <option value="psychologist">Психолог</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newUserData.grantAllPermissions}
                  onChange={e => setNewUserData({ ...newUserData, grantAllPermissions: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-900">Дать все права администратора</span>
              </label>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. УЧЕТНЫЕ ДАННЫЕ */}
      {showCredentialsModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Учетные данные созданы</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Внимание!</strong> Сохраните эти данные - они больше не будут отображаться!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Логин</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedCredentials.username}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.username)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Копировать
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Пароль</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedCredentials.password}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.password)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Копировать
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setShowCredentialsModal(false);
                  setGeneratedCredentials(null);
                }}
                className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ВСЕ ЛОГИ */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold text-white">Все логи активности</h2>
              <button
                onClick={() => setShowLogsModal(false)}
                className="text-gray-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-3">
              {activityLogs.map(log => (
                <div key={log.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">@{log.username}</span>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          {log.module}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-1">{log.action}</p>
                      <p className="text-xs text-gray-600">{log.details}</p>
                    </div>
                    <div className="text-xs text-gray-400">{log.ipAddress}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowLogsModal(false)}
                className="w-full px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
