import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type QuestionType = 'single' | 'multiple' | 'scale' | 'open';

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
  userAnswerIds?: string[];
}

interface TestModule {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  questions: Question[];
}

interface BlockResult {
  blockName: string;
  questions: number;
  score: number;
  confidence: number;
}

interface TestResult {
  moduleId: string;
  moduleName: string;
  startedAt: string;
  completedAt: string;
  totalScore: number;
  confidenceCoefficient: number;
  blockResults: BlockResult[];
  userAnswers: { questionId: string; answerId: string | string[] }[];
}

const Testing: React.FC = () => {
  const navigate = useNavigate();

  // Заглушка тестов
  const [modules] = useState<TestModule[]>([
    {
      id: '1',
      name: 'Психологическая оценка личности',
      description: 'Комплексное тестирование для оценки психологических характеристик',
      totalQuestions: 15,
      questions: [
        // Блок 1: Эмоциональная стабильность
        {
          id: 'q1',
          blockName: 'Эмоциональная стабильность',
          text: 'Как часто вы испытываете чувство тревоги?',
          type: 'single',
          answers: [
            { id: 'a1', text: 'Никогда', score: 1 },
            { id: 'a2', text: 'Редко', score: 0.75 },
            { id: 'a3', text: 'Часто', score: 0.5 },
            { id: 'a4', text: 'Постоянно', score: 0.25 },
          ],
        },
        {
          id: 'q2',
          blockName: 'Эмоциональная стабильность',
          text: 'Я легко справляюсь со стрессом',
          type: 'scale',
          answers: [
            { id: 'a1', text: 'Совсем не согласен', score: 0.2 },
            { id: 'a2', text: 'Скорее не согласен', score: 0.4 },
            { id: 'a3', text: 'Затрудняюсь ответить', score: 0.5 },
            { id: 'a4', text: 'Скорее согласен', score: 0.7 },
            { id: 'a5', text: 'Полностью согласен', score: 1 },
          ],
        },
        {
          id: 'q3',
          blockName: 'Эмоциональная стабильность',
          text: 'Какие из следующих методов помогают вам справляться с эмоциями? (выберите несколько)',
          type: 'multiple',
          maxSelections: 3,
          answers: [
            { id: 'a1', text: 'Физические упражнения', score: 1 },
            { id: 'a2', text: 'Медитация', score: 1 },
            { id: 'a3', text: 'Общение с друзьями', score: 0.75 },
            { id: 'a4', text: 'Сон', score: 0.5 },
          ],
        },
        {
          id: 'q4',
          blockName: 'Эмоциональная стабильность',
          text: 'Опишите ситуацию, когда вам удалось справиться со сложной эмоцией',
          type: 'open',
          answers: [{ id: 'a1', text: 'Текстовый ответ', score: 1 }],
        },

        // Блок 2: Социальная адаптация
        {
          id: 'q5',
          blockName: 'Социальная адаптация',
          text: 'Комфортно ли вам общаться с новыми людьми?',
          type: 'single',
          answers: [
            { id: 'a1', text: 'Очень комфортно', score: 1 },
            { id: 'a2', text: 'Довольно комфортно', score: 0.75 },
            { id: 'a3', text: 'Не совсем комфортно', score: 0.5 },
            { id: 'a4', text: 'Совсем не комфортно', score: 0.25 },
          ],
        },
        {
          id: 'q6',
          blockName: 'Социальная адаптация',
          text: 'Я легко нахожу общий язык с окружающими',
          type: 'scale',
          answers: [
            { id: 'a1', text: 'Совсем не согласен', score: 0.2 },
            { id: 'a2', text: 'Скорее не согласен', score: 0.4 },
            { id: 'a3', text: 'Затрудняюсь ответить', score: 0.5 },
            { id: 'a4', text: 'Скорее согласен', score: 0.7 },
            { id: 'a5', text: 'Полностью согласен', score: 1 },
          ],
        },
        {
          id: 'q7',
          blockName: 'Социальная адаптация',
          text: 'В каких ситуациях вы чувствуете себя социально уверенно? (выберите несколько)',
          type: 'multiple',
          maxSelections: 2,
          answers: [
            { id: 'a1', text: 'На работе с коллегами', score: 1 },
            { id: 'a2', text: 'На вечеринках с друзьями', score: 1 },
            { id: 'a3', text: 'На деловых встречах', score: 0.75 },
            { id: 'a4', text: 'В незнакомом обществе', score: 0.5 },
          ],
        },

        // Блок 3: Когнитивные способности
        {
          id: 'q8',
          blockName: 'Когнитивные способности',
          text: 'Как быстро вы обучаетесь новому материалу?',
          type: 'single',
          answers: [
            { id: 'a1', text: 'Очень быстро', score: 1 },
            { id: 'a2', text: 'Быстро', score: 0.75 },
            { id: 'a3', text: 'Средне', score: 0.5 },
            { id: 'a4', text: 'Медленно', score: 0.25 },
          ],
        },
        {
          id: 'q9',
          blockName: 'Когнитивные способности',
          text: 'Я легко сосредотачиваю внимание на сложных задачах',
          type: 'scale',
          answers: [
            { id: 'a1', text: 'Совсем не согласен', score: 0.2 },
            { id: 'a2', text: 'Скорее не согласен', score: 0.4 },
            { id: 'a3', text: 'Затрудняюсь ответить', score: 0.5 },
            { id: 'a4', text: 'Скорее согласен', score: 0.7 },
            { id: 'a5', text: 'Полностью согласен', score: 1 },
          ],
        },
        {
          id: 'q10',
          blockName: 'Когнитивные способности',
          text: 'Какие типы задач вам даются легче всего? (выберите несколько)',
          type: 'multiple',
          maxSelections: 2,
          answers: [
            { id: 'a1', text: 'Аналитические', score: 1 },
            { id: 'a2', text: 'Творческие', score: 1 },
            { id: 'a3', text: 'Практические', score: 0.75 },
            { id: 'a4', text: 'Теоретические', score: 0.5 },
          ],
        },
        {
          id: 'q11',
          blockName: 'Когнитивные способности',
          text: 'Приведите пример сложной проблемы, которую вам удалось решить',
          type: 'open',
          answers: [{ id: 'a1', text: 'Текстовый ответ', score: 1 }],
        },

        // Блок 4: Мотивация
        {
          id: 'q12',
          blockName: 'Мотивация',
          text: 'Как часто вы чувствуете мотивацию к действию?',
          type: 'single',
          answers: [
            { id: 'a1', text: 'Постоянно', score: 1 },
            { id: 'a2', text: 'Часто', score: 0.75 },
            { id: 'a3', text: 'Иногда', score: 0.5 },
            { id: 'a4', text: 'Редко', score: 0.25 },
          ],
        },
        {
          id: 'q13',
          blockName: 'Мотивация',
          text: 'Я способен доводить начатое до конца',
          type: 'scale',
          answers: [
            { id: 'a1', text: 'Совсем не согласен', score: 0.2 },
            { id: 'a2', text: 'Скорее не согласен', score: 0.4 },
            { id: 'a3', text: 'Затрудняюсь ответить', score: 0.5 },
            { id: 'a4', text: 'Скорее согласен', score: 0.7 },
            { id: 'a5', text: 'Полностью согласен', score: 1 },
          ],
        },
        {
          id: 'q14',
          blockName: 'Мотивация',
          text: 'Что вас мотивирует на достижение целей? (выберите несколько)',
          type: 'multiple',
          maxSelections: 3,
          answers: [
            { id: 'a1', text: 'Личный интерес', score: 1 },
            { id: 'a2', text: 'Признание и похвала', score: 1 },
            { id: 'a3', text: 'Финансовое вознаграждение', score: 0.75 },
            { id: 'a4', text: 'Давление и сроки', score: 0.5 },
          ],
        },
        {
          id: 'q15',
          blockName: 'Мотивация',
          text: 'Какая ваша главная жизненная цель?',
          type: 'open',
          answers: [{ id: 'a1', text: 'Текстовый ответ', score: 1 }],
        },
      ],
    },
  ]);

  // Состояния
  const [selectedModule, setSelectedModule] = useState<TestModule | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string | string[]>>(new Map());
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [showLogout, setShowLogout] = useState(false);

  // Выбор модуля
  const handleStartTest = (module: TestModule) => {
    setSelectedModule(module);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setTestResults(null);
  };

  // Выбор ответа для single/scale
  const handleSelectAnswer = (answerId: string) => {
    const question = selectedModule!.questions[currentQuestionIndex];
    const newAnswers = new Map(userAnswers);
    newAnswers.set(question.id, answerId);
    setUserAnswers(newAnswers);
  };

  // Выбор ответов для multiple
  const handleSelectMultiple = (answerId: string) => {
    const question = selectedModule!.questions[currentQuestionIndex];
    const currentAnswers = (userAnswers.get(question.id) as string[]) || [];
    const newAnswers = new Map(userAnswers);

    if (currentAnswers.includes(answerId)) {
      const filtered = currentAnswers.filter(id => id !== answerId);
      if (filtered.length === 0) {
        newAnswers.delete(question.id);
      } else {
        newAnswers.set(question.id, filtered);
      }
    } else {
      if (currentAnswers.length < (question.maxSelections || 999)) {
        newAnswers.set(question.id, [...currentAnswers, answerId]);
      }
    }
    setUserAnswers(newAnswers);
  };

  // Перейти к предыдущему вопросу
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Перейти к следующему вопросу
  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedModule!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompleteTest();
    }
  };

  // Завершение теста
  const handleCompleteTest = () => {
    if (!selectedModule) return;

    const answers: { questionId: string; answerId: string | string[] }[] = [];
    userAnswers.forEach((value, key) => {
      answers.push({ questionId: key, answerId: value });
    });

    // Подсчёт результатов по блокам
    const blockScores = new Map<string, { total: number; count: number }>();

    selectedModule.questions.forEach((question) => {
      const answer = userAnswers.get(question.id);
      if (answer) {
        if (Array.isArray(answer)) {
          // средняя по выбранным ответам
          const answerIds = answer;
          let total = 0;
          answerIds.forEach(aId => {
            const ans = question.answers.find(a => a.id === aId);
            if (ans) total += ans.score;
          });
          const avg = total / answerIds.length;
          const current = blockScores.get(question.blockName) || { total: 0, count: 0 };
          current.total += avg;
          current.count += 1;
          blockScores.set(question.blockName, current);
        } else {
          const ans = question.answers.find(a => a.id === answer);
          if (ans) {
            const current = blockScores.get(question.blockName) || { total: 0, count: 0 };
            current.total += ans.score;
            current.count += 1;
            blockScores.set(question.blockName, current);
          }
        }
      }
    });

    // Расчёт коэффициента доверия
    const blockResults: BlockResult[] = Array.from(blockScores.entries()).map(([blockName, data]) => ({
      blockName,
      questions: data.count,
      score: data.total / data.count,
      confidence: (data.total / data.count) * 100,
    }));

    const totalConfidence = blockResults.reduce((sum, br) => sum + br.confidence, 0) / blockResults.length;

    const result: TestResult = {
      moduleId: selectedModule.id,
      moduleName: selectedModule.name,
      startedAt: new Date().toLocaleString('ru-RU'),
      completedAt: new Date().toLocaleString('ru-RU'),
      totalScore: blockResults.reduce((sum, br) => sum + br.score, 0) / blockResults.length,
      confidenceCoefficient: totalConfidence,
      blockResults,
      userAnswers: answers,
    };

    setTestResults(result);
  };

  // Вернуться в меню
  const handleBackToMenu = () => {
    if (confirm('Вы уверены? Все ответы будут потеряны.')) {
      setSelectedModule(null);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Map());
      setTestResults(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    const labels = {
      single: 'Один ответ',
      multiple: 'Несколько ответов',
      scale: 'Шкала',
      open: 'Открытый ответ',
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToMenu}
                className="text-gray-600 hover:text-gray-900 p-1"
                title="Вернуться к выбору модулей"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Система тестирования</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/test-builder"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Конструктор тестов
              </Link>
              <button
                onClick={() => setShowLogout(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* МЕНЮ МОДУЛЕЙ */}
        {!selectedModule && !testResults && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Доступные модули тестирования</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <div key={module.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900">{module.name}</h3>
                    <p className="text-gray-600 mt-2">{module.description}</p>
                    <p className="text-sm text-gray-500 mt-3">Всего вопросов: {module.totalQuestions}</p>
                    <button
                      onClick={() => handleStartTest(module)}
                      className="mt-4 w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Начать тест
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ПРОХОЖДЕНИЕ ТЕСТА */}
        {selectedModule && !testResults && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* ПРОГРЕСС */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedModule.name}</h2>
                  <p className="text-xs text-gray-600 mt-1">
                    {getQuestionTypeLabel(selectedModule.questions[currentQuestionIndex].type)}
                    {selectedModule.questions[currentQuestionIndex].type === 'multiple' && (
                      <span> — Выберите до {selectedModule.questions[currentQuestionIndex].maxSelections} вариантов</span>
                    )}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  Вопрос {currentQuestionIndex + 1} из {selectedModule.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* ВОПРОС */}
            <div className="p-8">
              <div className="mb-8">
                <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
                  {selectedModule.questions[currentQuestionIndex].blockName}
                </p>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedModule.questions[currentQuestionIndex].text}
                </h3>
              </div>

              {/* ВАРИАНТЫ ОТВЕТОВ */}
              {selectedModule.questions[currentQuestionIndex].type === 'open' ? (
                <textarea
                  placeholder="Введите ваш ответ здесь..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
                  onChange={(e) => {
                    const question = selectedModule.questions[currentQuestionIndex];
                    const newAnswers = new Map(userAnswers);
                    newAnswers.set(question.id, 'open_' + e.target.value);
                    setUserAnswers(newAnswers);
                  }}
                />
              ) : selectedModule.questions[currentQuestionIndex].type === 'multiple' ? (
                <div className="space-y-3 mb-8">
                  {selectedModule.questions[currentQuestionIndex].answers.map((answer) => {
                    const currentAnswers = (userAnswers.get(selectedModule.questions[currentQuestionIndex].id) as string[]) || [];
                    const isSelected = currentAnswers.includes(answer.id);
                    const isDisabled = !isSelected && currentAnswers.length >= (selectedModule.questions[currentQuestionIndex].maxSelections || 999);
                    
                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleSelectMultiple(answer.id)}
                        disabled={isDisabled}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-colors flex items-center ${
                          isSelected
                            ? 'bg-blue-100 border-blue-600'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <span className="text-white text-sm">✓</span>}
                        </div>
                        <p className="font-medium text-gray-900">{answer.text}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 mb-8">
                  {selectedModule.questions[currentQuestionIndex].answers.map((answer) => (
                    <button
                      key={answer.id}
                      onClick={() => handleSelectAnswer(answer.id)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-colors ${
                        userAnswers.get(selectedModule.questions[currentQuestionIndex].id) === answer.id
                          ? 'bg-blue-100 border-blue-600'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{answer.text}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* КНОПКИ */}
              <div className="flex space-x-3">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Назад
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={!userAnswers.has(selectedModule.questions[currentQuestionIndex].id)}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex === selectedModule.questions.length - 1 ? 'Завершить тест' : 'Далее'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* РЕЗУЛЬТАТЫ */}
        {testResults && (
          <div className="space-y-6">
            {/* ОБЩАЯ СТАТИСТИКА */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white p-6 shadow-md">
                <p className="text-sm font-medium opacity-90">Общий коэффициент доверия</p>
                <p className="text-5xl font-bold mt-2">{testResults.confidenceCoefficient.toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white p-6 shadow-md">
                <p className="text-sm font-medium opacity-90">Средний балл</p>
                <p className="text-5xl font-bold mt-2">{testResults.totalScore.toFixed(2)}</p>
              </div>
            </div>

            {/* РЕЗУЛЬТАТЫ ПО БЛОКАМ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Результаты по блокам</h2>

              <div className="space-y-4">
                {testResults.blockResults.map((block, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{block.blockName}</h3>
                        <p className="text-sm text-gray-500 mt-1">Вопросов: {block.questions}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{block.confidence.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Балл: {block.score.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* ПРОГРЕСС БАР */}
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${block.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ИНФОРМАЦИЯ О ТЕСТЕ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Информация о тесте</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Модуль: <span className="font-semibold text-gray-900">{testResults.moduleName}</span></p>
                  <p className="text-gray-600 mt-2">Начат: <span className="font-semibold text-gray-900">{testResults.startedAt}</span></p>
                </div>
                <div>
                  <p className="text-gray-600">Завершён: <span className="font-semibold text-gray-900">{testResults.completedAt}</span></p>
                  <p className="text-gray-600 mt-2">Всего вопросов: <span className="font-semibold text-gray-900">{testResults.userAnswers.length}</span></p>
                </div>
              </div>
            </div>

            {/* КНОПКИ */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedModule(null);
                  setCurrentQuestionIndex(0);
                  setUserAnswers(new Map());
                  setTestResults(null);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Вернуться к модулям
              </button>
              <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                Скачать отчёт
              </button>
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

export default Testing;
