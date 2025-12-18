import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import { MessageSquare, Sparkles } from 'lucide-react';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!documentId) return;

      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);

        console.log("ChatHistory__Response:", response);

        const historyData =
          response?.data?.data ||
          response?.data?.history ||
          response?.history ||
          [];

        setHistory(historyData);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        setHistory([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      console.log("Assistant Response:", response);

      // FIX — SUPPORT ALL POSSIBLE RESPONSE PATHS
      const aiAnswer =
        response?.data?.data?.answer ||
        response?.data?.answer ||
        response?.answer ||
        "No answer";

      const assistantMessage = {
        role: 'assistant',
        content: aiAnswer,
        timestamp: new Date(),
        relevantChunks:
          response?.data?.data?.relevantChunks ||
          response?.data?.relevantChunks ||
          [],
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Render message bubble
  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}
      >
        {!isUser && (
          <div>
            <Sparkles strokeWidth={2} />
          </div>
        )}

        <div
          className={`max-w-lg p-4 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md'
              : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
          }`}
        >
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>

        {isUser && (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white">
            {(user?.username?.charAt(0).toUpperCase()) || 'U'}
          </div>
        )}
      </div>
    );
  };

  // Loading screen
  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-emerald-600" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="text-sm text-slate-500 mt-3 font-medium">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MessageSquare className="mx-auto mb-2 w-8 h-8" strokeWidth={2} />
            <h3 className="font-medium">Start a conversation</h3>
            <p className="text-sm">Ask me anything about the document!</p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex justify-start my-1">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-900 animate-pulse flex items-center">
              <Sparkles className="w-5 h-5 mr-2" strokeWidth={2} />
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex border-t border-slate-200/60 p-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />

        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
