import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type QuestionType = 'multiple' | 'single' | 'open' | 'scale';

interface Answer {
  id: string;
  text: string;
  score: number;
}

interface Question {
  id: string;
  blockName: string;
  text: string;
  type: QuestionType;
  answers: Answer[];
  maxSelections?: number; 
}

interface TestModule {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const TestBuilder: React.FC = () => {
  const navigate = useNavigate();

  // заглушка
  const [modules, setModules] = useState<TestModule[]>([
    {
      id: '1',
      name: 'Психологическая оценка личности',
      description: 'Комплексное тестирование для оценки психологических характеристик',
      questions: [],
      createdAt: '2025-11-08',
      updatedAt: '2025-11-09',
      createdBy: 'Иванов И.П.',
    },
  ]);

  // Состояния
  const [currentStep, setCurrentStep] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedModule, setSelectedModule] = useState<TestModule | null>(null);
  const [showLogout, setShowLogout] = useState(false);

  // Форма для создания модуля
  const [moduleForm, setModuleForm] = useState({
    name: '',
    description: '',
  });

  // Форма для вопроса
  const [questionForm, setQuestionForm] = useState({
    blockName: '',
    text: '',
    type: 'single' as QuestionType,
    answers: generateAnswersForType('single'),
    maxSelections: 2,
  });

  // Генерация вариантов ответов в зависимости от типа
  function generateAnswersForType(type: QuestionType): Answer[] {
    switch (type) {
      case 'multiple':
        return [
          { id: '1', text: '', score: 1 },
          { id: '2', text: '', score: 1 },
          { id: '3', text: '', score: 0.5 },
          { id: '4', text: '', score: 0 },
        ];
      case 'single':
        return [
          { id: '1', text: '', score: 1 },
          { id: '2', text: '', score: 0.75 },
          { id: '3', text: '', score: 0.5 },
          { id: '4', text: '', score: 0.25 },
        ];
      case 'open':
        return [{ id: '1', text: 'Текстовый ответ', score: 1 }];
      case 'scale':
        return [
          { id: '1', text: 'Совсем не согласен', score: 0.2 },
          { id: '2', text: 'Скорее не согласен', score: 0.4 },
          { id: '3', text: 'Затрудняюсь ответить', score: 0.5 },
          { id: '4', text: 'Скорее согласен', score: 0.7 },
          { id: '5', text: 'Полностью согласен', score: 1 },
        ];
      default:
        return [];
    }
  }

  const questionTypeDescriptions = {
    multiple: 'Несколько ответов - выбор нескольких правильных ответов',
    single: 'Один ответ - выбор одного правильного ответа',
    open: 'Открытый ответ - текстовое поле для свободного ввода',
    scale: 'Шкала - оценка от "совсем не согласен" до "полностью согласен"',
  };

  const questionTypeLabels = {
    multiple: 'Несколько ответов',
    single: 'Один ответ',
    open: 'Открытый ответ',
    scale: 'Шкала',
  };

  // Создание нового модуля
  const handleCreateModule = () => {
    if (!moduleForm.name.trim()) {
      alert('Введите название модуля');
      return;
    }

    const newModule: TestModule = {
      id: Date.now().toString(),
      name: moduleForm.name,
      description: moduleForm.description,
      questions: [],
      createdAt: new Date().toLocaleDateString('ru-RU'),
      updatedAt: new Date().toLocaleDateString('ru-RU'),
      createdBy: 'Иванов И.П.',
    };

    setModules([...modules, newModule]);
    setSelectedModule(newModule);
    setModuleForm({ name: '', description: '' });
    setCurrentStep('edit');
  };

  // Изменение типа вопроса
  const handleChangeQuestionType = (newType: QuestionType) => {
    setQuestionForm({
      ...questionForm,
      type: newType,
      answers: generateAnswersForType(newType),
    });
  };

  // Добавление нового варианта ответа
  const handleAddAnswer = () => {
    const newId = Math.max(0, ...questionForm.answers.map(a => parseInt(a.id))) + 1;
    const newAnswers = [...questionForm.answers, { id: newId.toString(), text: '', score: 0.5 }];
    setQuestionForm({ ...questionForm, answers: newAnswers });
  };

  // Удаление варианта ответа
  const handleRemoveAnswer = (answerIndex: number) => {
    if (questionForm.answers.length > 2) {
      const newAnswers = questionForm.answers.filter((_, idx) => idx !== answerIndex);
      setQuestionForm({ ...questionForm, answers: newAnswers });
    }
  };

  // Добавление вопроса
  const handleAddQuestion = () => {
    if (!selectedModule) return;
    if (!questionForm.blockName.trim() || !questionForm.text.trim()) {
      alert('Заполните все поля');
      return;
    }

    if (questionForm.type !== 'open' && questionForm.answers.some(a => !a.text.trim())) {
      alert('Заполните все варианты ответов');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      blockName: questionForm.blockName,
      text: questionForm.text,
      type: questionForm.type,
      answers: questionForm.answers,
      maxSelections: questionForm.type === 'multiple' ? questionForm.maxSelections : undefined,
    };

    const updatedModule = {
      ...selectedModule,
      questions: [...selectedModule.questions, newQuestion],
      updatedAt: new Date().toLocaleDateString('ru-RU'),
    };

    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
    setSelectedModule(updatedModule);
    setQuestionForm({
      blockName: '',
      text: '',
      type: 'single',
      answers: generateAnswersForType('single'),
      maxSelections: 2,
    });
  };

  // Удаление вопроса
  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedModule) return;

    const updatedModule = {
      ...selectedModule,
      questions: selectedModule.questions.filter(q => q.id !== questionId),
      updatedAt: new Date().toLocaleDateString('ru-RU'),
    };

    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
    setSelectedModule(updatedModule);
  };

  // Удаление модуля
  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот модуль?')) {
      setModules(modules.filter(m => m.id !== moduleId));
      setCurrentStep('list');
      setSelectedModule(null);
    }
  };

  // Редактирование варианта ответа
  const handleEditAnswer = (answerIndex: number, field: 'text' | 'score', value: string | number) => {
    const newAnswers = [...questionForm.answers];
    if (field === 'text') {
      newAnswers[answerIndex].text = value as string;
    } else {
      newAnswers[answerIndex].score = value as number;
    }
    setQuestionForm({ ...questionForm, answers: newAnswers });
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
              <button
                onClick={() => {
                  if (currentStep === 'edit') {
                    setCurrentStep('list');
                    setSelectedModule(null);
                  } else if (currentStep === 'create') {
                    setCurrentStep('list');
                  }
                }}
                className="text-gray-600 hover:text-gray-900 p-1"
                title="Вернуться назад"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Конструктор тестов</h1>
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
        {/* СПИСОК МОДУЛЕЙ */}
        {currentStep === 'list' && (
          <div className="space-y-6">
            {/* КНОПКА СОЗДАНИЯ */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setCurrentStep('create');
                  setModuleForm({ name: '', description: '' });
                }}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Создать новый модуль
              </button>
            </div>

            {/* ТАБЛИЦА МОДУЛЕЙ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Название</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Описание</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Вопросов</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Создатель</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Обновлено</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {modules.map((module) => (
                    <tr key={module.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{module.name}</td>
                      <td className="px-6 py-4 text-gray-600">{module.description}</td>
                      <td className="px-6 py-4 text-gray-600">{module.questions.length}</td>
                      <td className="px-6 py-4 text-gray-600">{module.createdBy}</td>
                      <td className="px-6 py-4 text-gray-600">{module.updatedAt}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedModule(module);
                            setCurrentStep('edit');
                          }}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* СОЗДАНИЕ МОДУЛЯ */}
        {currentStep === 'create' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Создание нового модуля</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Название модуля</label>
                  <input
                    type="text"
                    value={moduleForm.name}
                    onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                    placeholder="Например: Психологическая оценка личности"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Описание</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    placeholder="Подробное описание модуля тестирования"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setCurrentStep('list')}
                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateModule}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Создать модуль
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ МОДУЛЯ */}
        {currentStep === 'edit' && selectedModule && (
          <div className="space-y-6">
            {/* ИНФОРМАЦИЯ О МОДУЛЕ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedModule.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedModule.description}</p>
                </div>
              </div>
            </div>

            {/* СПИСОК ВОПРОСОВ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Вопросы ({selectedModule.questions.length})</h3>

              {selectedModule.questions.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Вопросов еще нет. Добавьте первый вопрос.</p>
              ) : (
                <div className="space-y-4">
                  {selectedModule.questions.map((question, idx) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-600 uppercase">{question.blockName}</p>
                          <p className="font-medium text-gray-900 mt-1">№{idx + 1}. {question.text}</p>
                          <p className="text-sm text-gray-600 mt-2">Тип: {questionTypeLabels[question.type]}</p>
                          {question.type === 'multiple' && (
                            <p className="text-sm text-gray-600">Максимум выборов: {question.maxSelections}</p>
                          )}
                          {question.type !== 'open' && (
                            <div className="mt-3 space-y-1">
                              {question.answers.map((ans, ansIdx) => (
                                <p key={ansIdx} className="text-xs text-gray-600">
                                  {String.fromCharCode(65 + ansIdx)}) {ans.text} (оценка: {ans.score})
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ДОБАВЛЕНИЕ ВОПРОСА */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Добавить новый вопрос</h3>

              <div className="space-y-6">
                {/* БЛОК */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Блок (категория)</label>
                  <input
                    type="text"
                    value={questionForm.blockName}
                    onChange={(e) => setQuestionForm({ ...questionForm, blockName: e.target.value })}
                    placeholder="Например: Эмоциональная стабильность"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ТЕКСТ ВОПРОСА */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Текст вопроса</label>
                  <textarea
                    value={questionForm.text}
                    onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                    placeholder="Введите текст вопроса"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ТИП ВОПРОСА */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Тип вопроса</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(questionTypeLabels) as QuestionType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleChangeQuestionType(type)}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          questionForm.type === type
                            ? 'bg-blue-100 border-blue-600'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{questionTypeLabels[type]}</p>
                        <p className="text-xs text-gray-600 mt-1">{questionTypeDescriptions[type]}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {questionForm.type === 'multiple' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Максимум выборов</label>
                    <input
                      type="number"
                      value={questionForm.maxSelections}
                      onChange={(e) => setQuestionForm({ ...questionForm, maxSelections: parseInt(e.target.value) })}
                      min="1"
                      max={questionForm.answers.length}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ограничивает количество ответов, которые может выбрать пользователь</p>
                  </div>
                )}

                {/* ВАРИАНТЫ ОТВЕТОВ */}
                {questionForm.type !== 'open' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-900">Варианты ответов</label>
                      {(questionForm.type === 'single' || questionForm.type === 'multiple') && (
                        <button
                          onClick={handleAddAnswer}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Добавить ответ
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {questionForm.answers.map((answer, idx) => (
                        <div key={idx} className="flex items-end space-x-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={answer.text}
                              onChange={(e) => handleEditAnswer(idx, 'text', e.target.value)}
                              placeholder={`Ответ ${idx + 1}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              value={answer.score}
                              onChange={(e) => handleEditAnswer(idx, 'score', parseFloat(e.target.value))}
                              min="0"
                              max="1"
                              step="0.25"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          {(questionForm.type === 'single' || questionForm.type === 'multiple') && questionForm.answers.length > 2 && (
                            <button
                              onClick={() => handleRemoveAnswer(idx)}
                              className="px-2 py-2 text-red-600 hover:bg-red-100 rounded"
                              title="Удалить ответ"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Оценка: 1 (отлично), 0.75 (хорошо), 0.5 (средне), 0.25 (плохо)</p>
                  </div>
                )}

                {/* ПРИМЕЧАНИЕ ДЛЯ ОТКРЫТОГО ОТВЕТА */}
                {questionForm.type === 'open' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Примечание:</span> При выборе типа "Открытый ответ" пользователь будет вводить текст вручную. Оценивание происходит вручную администратором.
                    </p>
                  </div>
                )}

                {/* КНОПКА ДОБАВЛЕНИЯ */}
                <button
                  onClick={handleAddQuestion}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 mt-6"
                >
                  Добавить вопрос
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

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

export default TestBuilder;
