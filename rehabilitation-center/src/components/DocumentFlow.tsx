import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type DocumentStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'archived';
type DocumentType = 'report' | 'test' | 'conclusion' | 'recommendation' | 'other';

interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  size: string;
  description: string;
  recipient?: string;
  comments?: number;
}

interface DocumentFilter {
  status: DocumentStatus | 'all';
  type: DocumentType | 'all';
  search: string;
}

const DocumentFlow: React.FC = () => {
  const navigate = useNavigate();

  // заглушка-документов
  const [documents] = useState<DocumentItem[]>([
    {
      id: '1',
      name: 'Заключение психолога Петрова П.И.',
      type: 'conclusion',
      status: 'approved',
      createdBy: 'Иванов И.П.',
      createdAt: '2025-11-08',
      updatedAt: '2025-11-09',
      size: '2.3 MB',
      description: 'Психологическое заключение по результатам диагностики',
      recipient: 'Петрова А.И.',
      comments: 2,
    },
    {
      id: '2',
      name: 'Отчет о тестировании Q3 2025',
      type: 'report',
      status: 'sent',
      createdBy: 'Сидорова А.И.',
      createdAt: '2025-11-07',
      updatedAt: '2025-11-09',
      size: '1.8 MB',
      description: 'Квартальный отчет о результатах тестирования детей',
      recipient: 'Администрация',
      comments: 5,
    },
    {
      id: '3',
      name: 'Рекомендации по развитию для Марии С.',
      type: 'recommendation',
      status: 'draft',
      createdBy: 'Смирнов И.А.',
      createdAt: '2025-11-09',
      updatedAt: '2025-11-09',
      size: '0.9 MB',
      description: 'Персональные рекомендации для ребенка',
      comments: 0,
    },
    {
      id: '4',
      name: 'Результаты тестирования когнитивных способностей',
      type: 'test',
      status: 'approved',
      createdBy: 'Козлова О.С.',
      createdAt: '2025-11-06',
      updatedAt: '2025-11-08',
      size: '3.1 MB',
      description: 'Результаты комплексного тестирования 25 учащихся',
      recipient: 'Родители',
      comments: 12,
    },
    {
      id: '5',
      name: 'Заключение по коррекционной работе',
      type: 'conclusion',
      status: 'rejected',
      createdBy: 'Петров М.В.',
      createdAt: '2025-11-05',
      updatedAt: '2025-11-09',
      size: '1.5 MB',
      description: 'Требуется дополнение данных по динамике развития',
      comments: 3,
    },
    {
      id: '6',
      name: 'Отчет о проведенных консультациях',
      type: 'report',
      status: 'archived',
      createdBy: 'Иванов И.П.',
      createdAt: '2025-10-15',
      updatedAt: '2025-11-01',
      size: '0.6 MB',
      description: 'Архивный отчет за октябрь 2025',
      comments: 1,
    },
  ]);

  // Состояния
  const [filter, setFilter] = useState<DocumentFilter>({
    status: 'all',
    type: 'all',
    search: '',
  });
  const [showUpload, setShowUpload] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [showComments, setShowComments] = useState(false);

  // Фильтрация документов
  const filteredDocuments = documents.filter((doc) => {
    const matchStatus = filter.status === 'all' || doc.status === filter.status;
    const matchType = filter.type === 'all' || doc.type === filter.type;
    const matchSearch = doc.name.toLowerCase().includes(filter.search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  // Загрузка документа
  const handleUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowUpload(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Статусы
  const statusConfig = {
    draft: { label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
    sent: { label: 'Отправлен', color: 'bg-blue-100 text-blue-800' },
    approved: { label: 'Одобрен', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Отклонен', color: 'bg-red-100 text-red-800' },
    archived: { label: 'Архив', color: 'bg-purple-100 text-purple-800' },
  };

  const typeConfig = {
    report: { label: 'Отчёт' },
    test: { label: 'Тесты' },
    conclusion: { label: 'Заключение' },
    recommendation: { label: 'Рекомендация' },
    other: { label: 'Прочее' },
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Документооборот</h1>
            </div>
            <button
              onClick={() => setShowLogout(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* СТАТИСТИКА */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Всего документов', value: documents.length, color: 'from-blue-500 to-blue-600' },
            { label: 'Черновики', value: documents.filter(d => d.status === 'draft').length, color: 'from-gray-500 to-gray-600' },
            { label: 'Одобренные', value: documents.filter(d => d.status === 'approved').length, color: 'from-green-500 to-green-600' },
            { label: 'На рассмотрении', value: documents.filter(d => d.status === 'sent').length, color: 'from-blue-500 to-blue-600' },
            { label: 'Отклоненные', value: documents.filter(d => d.status === 'rejected').length, color: 'from-red-500 to-red-600' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-md`}>
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ФИЛЬТРЫ И ЗАГРУЗКА */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* ПОИСК */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Поиск</label>
              <input
                type="text"
                placeholder="Название документа..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* СТАТУС */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Статус</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value as DocumentFilter['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="draft">Черновик</option>
                <option value="sent">Отправлен</option>
                <option value="approved">Одобрен</option>
                <option value="rejected">Отклонен</option>
                <option value="archived">Архив</option>
              </select>
            </div>

            {/* ТИП */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Тип документа</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value as DocumentFilter['type'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Все типы</option>
                <option value="report">Отчёт</option>
                <option value="test">Тесты</option>
                <option value="conclusion">Заключение</option>
                <option value="recommendation">Рекомендация</option>
                <option value="other">Прочее</option>
              </select>
            </div>

            {/* КНОПКА ЗАГРУЗКИ */}
            <div className="flex items-end">
              <button
                onClick={() => setShowUpload(true)}
                className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Загрузить</span>
              </button>
            </div>
          </div>
        </div>

        {/* СПИСОК ДОКУМЕНТОВ */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Документ</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Тип</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Статус</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Создал</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Дата</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Размер</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {typeConfig[doc.type].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[doc.status].color}`}>
                          {statusConfig[doc.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.createdBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.updatedAt}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setShowComments(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900"
                            title="Комментарии"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {doc.comments > 0 && <span className="text-xs font-bold ml-1">{doc.comments}</span>}
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900" title="Скачать">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900" title="Удалить">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-gray-600">Документы не найдены</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО ЗАГРУЗКИ */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
              <h3 className="text-lg font-bold text-blue-900">Загрузить документ</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* ОБЛАСТЬ ЗАГРУЗКИ */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-700 font-medium">Перетащите файл или кликните</p>
                <p className="text-sm text-gray-500">Максимум 100 MB</p>
              </div>

              {/* ПРОГРЕСС */}
              {uploadProgress > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Загрузка: {uploadProgress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* ПОЛЯ */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Название документа</label>
                  <input type="text" placeholder="Введите название..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Тип документа</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Отчёт</option>
                    <option>Тесты</option>
                    <option>Заключение</option>
                    <option>Рекомендация</option>
                    <option>Прочее</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Описание</label>
                  <textarea placeholder="Описание документа..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* КНОПКИ */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpload(false)}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Загрузить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО КОММЕНТАРИЕВ */}
      {showComments && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-96 overflow-y-auto">
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-4 sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-blue-900">{selectedDoc.name}</h3>
                <button onClick={() => setShowComments(false)} className="text-gray-600 hover:text-gray-900 text-xl">×</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {[
                { author: 'Администратор', text: 'Требуется дополнение данных по динамике развития', time: '2 часа назад' },
                { author: 'Вы', text: 'Спасибо за замечание, добавлю информацию', time: '1 час назад' },
              ].map((comment, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-semibold text-gray-900">{comment.author}</p>
                  <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-2">{comment.time}</p>
                </div>
              ))}

              {/* НОВЫЙ КОММЕНТАРИЙ */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <textarea placeholder="Добавить комментарий..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button className="mt-3 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ВЫХОД */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <h3 className="text-lg font-bold text-red-900">Вы уверены?</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">Вы действительно хотите выйти из системы?</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
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

export default DocumentFlow;
