import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, QuickReply, ChatIntent } from '../types';
import { INITIAL_QUICK_REPLIES, CHAT_INTENTS, FALLBACK_INTENT } from '../chatbot/intents';
import { findMatchingIntent } from '../chatbot/matcher';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'msg_welcome',
  sender: 'bot',
  text: `👋 **Welcome to Vayudhara Assistant!**

How can I help you today? You can ask me anything about our **Commercial Drone Services**, **DGCA Pilot Academy**, or **how to register**.

Choose a quick prompt below or type your question.`,
  timestamp: new Date(),
  quickReplies: INITIAL_QUICK_REPLIES,
};

const CHAT_STORAGE_KEY = 'vayudhara_chat_history_v1';

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
    return [WELCOME_MESSAGE];
  });
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Sync session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore quota errors
    }
  }, [messages]);

  // Open & Close Toggles
  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
        setIsMinimized(false);
      }
      return next;
    });
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Reset conversation
  const resetChat = useCallback(() => {
    const freshWelcome: ChatMessage = {
      ...WELCOME_MESSAGE,
      id: `msg_welcome_${Date.now()}`,
      timestamp: new Date(),
    };
    setMessages([freshWelcome]);
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {}
  }, []);

  // Process and send user message
  const sendMessage = useCallback(
    async (rawText: string, quickReplyIntentId?: string) => {
      const text = rawText.trim();
      if (!text) return;

      const userMsgId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const userMessage: ChatMessage = {
        id: userMsgId,
        sender: 'user',
        text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Determine intent
      let matchedIntent: ChatIntent;
      if (quickReplyIntentId) {
        matchedIntent =
          CHAT_INTENTS.find((i) => i.id === quickReplyIntentId) || FALLBACK_INTENT;
      } else {
        matchedIntent = findMatchingIntent(text);
      }

      // Simulate humanized bot typing delay (300-600ms)
      await new Promise((res) => setTimeout(res, 400));

      const botMsgId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const botResponse: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: matchedIntent.response,
        timestamp: new Date(),
        quickReplies: matchedIntent.followUpReplies || INITIAL_QUICK_REPLIES,
        isEnquiryPrompt: matchedIntent.suggestEnquiry,
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    },
    [isOpen]
  );

  // Handle Quick Reply selection
  const handleQuickReply = useCallback(
    (qr: QuickReply) => {
      sendMessage(qr.text, qr.intentId);
    },
    [sendMessage]
  );

  return {
    isOpen,
    isMinimized,
    messages,
    isTyping,
    unreadCount,
    openChat,
    closeChat,
    toggleChat,
    toggleMinimize,
    resetChat,
    sendMessage,
    handleQuickReply,
  };
};
