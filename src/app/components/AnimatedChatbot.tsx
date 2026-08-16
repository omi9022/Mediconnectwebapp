import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  userType?: 'customer' | 'hospital' | 'support';
}

export default function AnimatedChatbot({ userType = 'customer' }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your MediConnect Assistant. How can I help you today?\n\n• Find medicines and supplies\n• Track your orders\n• Payment assistance\n• Platform guidance',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const getThemeColors = () => {
    // All portals use the dark navy palette from the brand identity
    return {
      primary: 'bg-[#1a2f5c]',
      primaryHover: 'hover:bg-[#243f7a]',
      primaryLight: 'bg-[#eef1f8]',
      primaryBorder: 'border-[#1a2f5c]',
      primaryText: 'text-[#1a2f5c]',
      gradient: 'bg-gradient-to-br from-[#1a2f5c] to-[#243f7a]',
    };
  };

  const colors = getThemeColors();

  const getSystemPrompt = () => {
    return `You are MediConnect Assistant, a helpful AI chatbot for the MediConnect healthcare supply chain platform.

Platform Overview:
- MediConnect connects customers, hospitals, and suppliers
- 864+ medical supplies across 8 categories
- 5 payment methods: Card, UPI, Net Banking, Wallet, COD
- 4 verified suppliers (4.5-4.8 star ratings)
- Real-time order tracking and delivery

Your Role:
- Help find medical supplies and medicines
- Assist with order tracking and delivery info
- Explain payment methods and processes
- Provide platform guidance
- Be friendly, professional, and helpful
- Keep responses clear and concise
- Do not use emojis
- Always recommend consulting doctors for medical advice

Current User: ${userType}`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      conversationHistory.push({
        role: 'user',
        content: input.trim(),
      });

      // Using a mock response since we can't actually call Anthropic API from the browser without a proxy/backend in this environment usually, 
      // but the user provided code includes a fetch to Anthropic.
      // I will keep the code as provided but wrap it in a try/catch that falls back to the local logic if it fails (which it likely will due to CORS or key requirements not being present).
      // Wait, the user code DOES NOT include an API key in the fetch call headers? 
      // It just says 'anthropic-version'. It is missing 'x-api-key'.
      // So the fetch will definitely fail 401.
      // The user's code has a catch block that calls `getFallbackResponse`. So it handles failure gracefully.
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          // Missing API key
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', // Also this model name might be fictional or future-dated in the prompt context
          max_tokens: 1024,
          system: getSystemPrompt(),
          messages: conversationHistory,
        }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const assistantResponse = data.content[0].text;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(input.trim()),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('order') || lowerQuery.includes('track')) {
      return 'To track your order, please visit the Logistics section in your dashboard.\n\nYou can view:\n• Real-time tracking information\n• Driver details and contact\n• Estimated arrival time\n• Delivery route\n\nIf you need help with a specific order, please provide your order number.';
    }

    if (lowerQuery.includes('medicine') || lowerQuery.includes('product')) {
      return 'Browse our catalog of 864+ medical supplies across 8 categories:\n\n• Emergency medicines (45 items)\n• Pharmaceutical products (234 items)\n• Surgical supplies (128 items)\n• Diagnostic equipment (56 items)\n• Consumables (312 items)\n• Medical equipment (89 items)\n\nUse the Stock Search section with filters to find exactly what you need.';
    }

    if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
      return 'We support 5 secure payment methods:\n\n1. Credit/Debit Card - All major cards accepted\n2. UPI - GPay, PhonePe supported\n3. Net Banking - All major banks\n4. Digital Wallets - Paytm, Amazon Pay, PhonePe Wallet\n5. Cash on Delivery - Available for eligible orders\n\nAll payments are encrypted and secure. You can save payment methods for faster checkout.';
    }

    if (lowerQuery.includes('delivery') || lowerQuery.includes('shipping')) {
      return 'We offer multiple delivery options:\n\n• Standard Delivery: 3-5 business days\n• Express Delivery: 1-2 business days\n• Same-day Delivery: Available in select locations\n\nDelivery charges vary by location and order value. Orders above Rs.500 qualify for free standard delivery.\n\nTrack your delivery in real-time through the Logistics section.';
    }

    if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      return 'Our platform helps you compare prices and save:\n\n• Compare prices across 4 verified suppliers\n• View market prices and our discounted rates\n• Calculate your total savings\n• See supplier ratings and reviews\n\nWe offer competitive pricing with potential savings of up to 30% on many items.';
    }

    return 'I can help you with:\n\n• Finding medicines and medical supplies\n• Tracking orders and deliveries\n• Payment methods and processing\n• Product information and pricing\n• General platform navigation\n\nPlease let me know what specific information you need.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 ${colors.gradient} text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-teal-500/50 z-50 animate-bounce-slow group`}
          aria-label="Open chatbot"
        >
          <Bot className="w-7 h-7 animate-pulse-slow" />
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.primary} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-5 w-5 ${colors.primary} items-center justify-center`}>
              <Sparkles className="w-3 h-3 text-white" />
            </span>
          </span>
        </button>
        
        {showWelcome && (
          <div className={`fixed bottom-24 right-6 ${colors.primaryLight} border-2 ${colors.primaryBorder} rounded-lg p-4 shadow-lg z-50 animate-slide-up max-w-xs`}>
            <div className="flex items-start gap-3">
              <div className={`${colors.gradient} rounded-full p-2 flex-shrink-0`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Need help?</p>
                <p className="text-xs text-gray-600 mt-1">I'm here to assist you!</p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-500 ease-out transform ${
        isMinimized ? 'w-80 h-16 scale-95' : 'w-96 h-[600px] scale-100'
      } animate-slide-up`}
      style={{
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header */}
      <div className={`${colors.gradient} text-white p-4 rounded-t-2xl flex items-center justify-between shadow-md relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white opacity-10 animate-shimmer"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <div className={`${colors.primary} rounded-full p-2 animate-pulse-slow`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm">MediConnect AI</h3>
            {!isMinimized && (
              <p className="text-xs text-white/80 flex items-center gap-1 animate-fade-in">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online - Ready to help
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Close chatbot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-slide-in ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.role === 'assistant' && (
                  <div className={`w-9 h-9 rounded-full ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-md animate-bounce-gentle`}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-3 shadow-md transition-all duration-300 hover:shadow-lg ${
                    message.role === 'user'
                      ? `${colors.gradient} text-white transform hover:scale-105`
                      : 'bg-white text-gray-800 border-2 border-gray-100 hover:border-teal-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      message.role === 'user' ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    <span className="inline-block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.role === 'user' && (
                      <span className="text-xs">✓✓</span>
                    )}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className={`w-9 h-9 rounded-full ${colors.gradient} flex items-center justify-center flex-shrink-0 shadow-md animate-pulse`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white text-gray-800 border-2 border-gray-100 rounded-2xl p-4 shadow-md">
                  <div className="flex gap-1.5">
                    <div className={`w-2.5 h-2.5 ${colors.primary} rounded-full animate-bounce`} style={{ animationDelay: '0s' }} />
                    <div className={`w-2.5 h-2.5 ${colors.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
                    <div className={`w-2.5 h-2.5 ${colors.primary} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['Products', 'Track Order', 'Payments', 'Delivery'].map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(action)}
                  className={`px-3 py-1.5 ${colors.primaryLight} ${colors.primaryText} rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-md animate-fade-in`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t-2 border-gray-100 p-4 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`${colors.gradient} hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:scale-100`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Press Enter to send
            </p>
          </div>
        </>
      )}
    </div>
  );
}
