import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
  isGroup: boolean;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  edited?: boolean;
}

interface Chat {
  id: string;
  user: ChatUser;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: string;
}

// компонент чата
const PsychologistChat: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // заглушка с чатами
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Сидорова Анна Ивановна',
        avatar: 'СА',
        status: 'online',
        lastSeen: 'в сети',
        isGroup: false,
        unreadCount: 0,
      },
      messages: [
        { id: '1', userId: '1', userName: 'Сидорова А.И.', userAvatar: 'СА', text: 'Добрый день! Как дела?', timestamp: '09:15', isOwn: false },
        { id: '2', userId: 'me', userName: 'Вы', userAvatar: 'ИИ', text: 'Привет! Всё хорошо, спасибо', timestamp: '09:16', isOwn: true },
        { id: '3', userId: '1', userName: 'Сидорова А.И.', userAvatar: 'СА', text: 'Кстати, обсудили результаты тестирования Петрова?', timestamp: '09:17', isOwn: false },
        { id: '4', userId: 'me', userName: 'Вы', userAvatar: 'ИИ', text: 'Да, результаты хорошие', timestamp: '09:18', isOwn: true },
        { id: '5', userId: '1', userName: 'Сидорова А.И.', userAvatar: 'СА', text: 'Супер! А как дела с Мариной?', timestamp: '09:20', isOwn: false },
        { id: '6', userId: 'me', userName: 'Вы', userAvatar: 'ИИ', text: 'С Мариной идет обычно, провел 3 сессии', timestamp: '09:21', isOwn: true },
        { id: '7', userId: '1', userName: 'Сидорова А.И.', userAvatar: 'СА', text: 'Хорошо, нужно обсудить подробнее', timestamp: '09:22', isOwn: false },
        { id: '8', userId: 'me', userName: 'Вы', userAvatar: 'ИИ', text: 'Конечно, когда удобно?', timestamp: '09:23', isOwn: true },
        { id: '9', userId: '1', userName: 'Сидорова А.И.', userAvatar: 'СА', text: 'Может быть завтра в 14:00?', timestamp: '09:25', isOwn: false },
        { id: '10', userId: 'me', userName: 'Вы', userAvatar: 'ИИ', text: 'Подходит, давай в 14:00', timestamp: '09:26', isOwn: true },
        { id: '11', userId: '1', userName: 'Сидорова А.И.', userAvatar: 'СА', text: 'Спасибо! До завтра', timestamp: '09:27', isOwn: false },
        { id: '12', userId: 'me', userName: 'Вы', userAvatar: 'ИИ', text: 'До свидания!', timestamp: '09:28', isOwn: true },
      ],
      lastMessage: 'До свидания!',
      lastMessageTime: '09:28',
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Смирнов Иван Алексеевич',
        avatar: 'СИ',
        status: 'offline',
        lastSeen: '30 минут назад',
        isGroup: false,
        unreadCount: 2,
      },
      messages: [
        { id: '1', userId: '2', userName: 'Смирнов И.А.', userAvatar: 'СИ', text: 'Передал документы?', timestamp: '12:15', isOwn: false },
      ],
      lastMessage: 'Передал документы?',
      lastMessageTime: '12:15',
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Психологи центра',
        avatar: 'ПЦ',
        status: 'online',
        lastSeen: '3 участника',
        isGroup: true,
        unreadCount: 5,
      },
      messages: [
        { id: '1', userId: 'admin', userName: 'Администратор', userAvatar: 'АД', text: 'Завтра встреча в 11:00', timestamp: '10:45', isOwn: false },
      ],
      lastMessage: 'Завтра встреча в 11:00',
      lastMessageTime: '10:45',
    },
  ]);

  // Состояния
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(selectedChat.messages);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showLogout, setShowLogout] = useState(false);

  // скролл к последнему сообщению
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    return () => clearTimeout(timer);
  }, [messages]);

  // Переключение чата
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setEditingMessageId(null);
    setMessageInput('');
  };

  // Отправка сообщения
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'me',
      userName: 'Иванов И.П.',
      userAvatar: 'ИИ',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  // Редактирование сообщения
  const handleEditMessage = (messageId: string, text: string) => {
    setEditingMessageId(messageId);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    if (!editingText.trim()) return;

    setMessages(
      messages.map((msg) =>
        msg.id === editingMessageId
          ? { ...msg, text: editingText, edited: true }
          : msg
      )
    );
    setEditingMessageId(null);
    setEditingText('');
  };

  // Удаление сообщения
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  // Фильтрация чатов
  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex-shrink-0">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Чат психологов</h1>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            Выход
          </button>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ЛЕВАЯ ПАНЕЛЬ - СПИСОК ЧАТОВ */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* ПОИСК */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* СПИСОК ЧАТОВ */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedChat.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* АВАТАР */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {chat.user.avatar}
                    </div>
                    {!chat.user.isGroup && (
                      <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(chat.user.status)} rounded-full border-2 border-white`}></div>
                    )}
                  </div>

                  {/* ИНФОРМАЦИЯ ЧАТА */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.user.name}</h3>
                      <span className="text-xs text-gray-500 ml-2">{chat.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.user.unreadCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 bg-blue-600 rounded-full">
                          {chat.user.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ - ЧАТ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ЗАГОЛОВОК ЧАТА */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {selectedChat.user.avatar}
                </div>
                {!selectedChat.user.isGroup && (
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(selectedChat.user.status)} rounded-full border-2 border-white`}></div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedChat.user.name}</h2>
                <p className="text-sm text-gray-600">{selectedChat.user.lastSeen}</p>
              </div>
            </div>

            {/* КНОПКИ */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* СООБЩЕНИЯ */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                  {/* СООБЩЕНИЕ */}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isOwn
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {editingMessageId === message.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none"
                        autoFocus
                      />
                    ) : (
                      <>
                        <p className="text-sm break-words">{message.text}</p>
                        {message.edited && <p className="text-xs opacity-75 mt-1">отредактировано</p>}
                      </>
                    )}
                  </div>

                  {/* ВРЕМЯ И ДЕЙСТВИЯ */}
                  <div className={`flex items-center justify-between mt-1 text-xs text-gray-600 ${message.isOwn ? 'flex-row-reverse' : ''} space-x-2 ${message.isOwn ? 'space-x-reverse' : ''}`}>
                    <span>{message.timestamp}</span>

                    {message.isOwn && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        {editingMessageId === message.id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                              title="Сохранить"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="text-red-600 hover:text-red-700 font-medium"
                              title="Отмена"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditMessage(message.id, message.text)}
                              className="text-gray-600 hover:text-blue-600"
                              title="Редактировать"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-gray-600 hover:text-red-600"
                              title="Удалить"
                            >
                              🗑
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* ВВОД СООБЩЕНИЯ */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0 h-auto">
            <div className="flex items-center space-x-3">
              {/* КНОПКА ФАЙЛА */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* ПОЛЕ ВВОДА */}
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Сообщение..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              {/* КНОПКА ОТПРАВКИ */}
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.9429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.05492849 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4 C0.994623095,2.0629498 0.837654326,3.16234968 1.15159189,3.94784655 L3.03521743,10.3889397 C3.03521743,10.5460371 3.19218622,10.7031345 3.50612381,10.7031345 L16.6915026,11.4886214 C16.6915026,11.4886214 17.1624089,11.4886214 17.1624089,12.0529426 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ВЫХОДА */}
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

export default PsychologistChat;
