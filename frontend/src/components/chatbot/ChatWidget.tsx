import React, { useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Minus,
  RotateCcw,
  Sparkles,
  Plane,
  ChevronDown,
} from 'lucide-react';
import { useChatbot } from '../../hooks/useChatbot';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  onOpenEnquiryModal?: (serviceInterest?: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen: propIsOpen,
  onToggle: propOnToggle,
  onClose: propOnClose,
  onOpenEnquiryModal,
}) => {
  const {
    isOpen: hookIsOpen,
    isMinimized,
    messages,
    isTyping,
    unreadCount,
    toggleChat,
    toggleMinimize,
    closeChat,
    resetChat,
    sendMessage,
    handleQuickReply,
  } = useChatbot();

  const isOpen = propIsOpen !== undefined ? propIsOpen : hookIsOpen;
  const handleToggle = propOnToggle || toggleChat;

  const handleClose = () => {
    closeChat();
    if (propOnClose) {
      propOnClose();
    } else if (propOnToggle && isOpen) {
      propOnToggle();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or typing state changes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end pointer-events-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div
          className={`pointer-events-auto w-[calc(100vw-24px)] sm:w-[390px] bg-white border border-slate-900/15 rounded-2xl sm:rounded-[20px] shadow-[0_20px_50px_rgba(15,23,42,0.25)] flex flex-col overflow-hidden transition-all duration-200 ease-out mb-3.5 ${
            isMinimized
              ? 'h-14 sm:h-[60px] shadow-md'
              : 'h-[560px] sm:h-[590px] max-h-[min(620px,calc(100vh-100px))]'
          }`}
          style={{
            animation: 'chatSlideIn 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header */}
          <div className="h-[60px] px-4 py-3 bg-[#0B1628] text-white flex items-center justify-between shrink-0 select-none border-b border-slate-800 shadow-xs">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={toggleMinimize}
            >
              <div className="w-8 h-8 rounded-lg bg-[#0788C9]/20 border border-[#0788C9]/30 flex items-center justify-center text-[#38BDF8]">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="font-bold text-[14px] text-white tracking-tight">Vayudhara Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-[11px] text-slate-300 font-medium tracking-wide mt-1">
                  DGCA & Commercial Aero Support
                </p>
              </div>
            </div>

            {/* Header Action Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Reset Chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleMinimize}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Minimize Chat"
              >
                {isMinimized ? (
                  <ChevronDown className="w-4 h-4 rotate-180" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Viewport (hidden if minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto bg-[#F8FAFC] space-y-3">
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    onQuickReplyClick={handleQuickReply}
                    onOpenEnquiryModal={onOpenEnquiryModal}
                  />
                ))}

                {/* Bot Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2.5 my-3">
                    <div className="w-7 h-7 rounded-full bg-[#0788C9] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-3 bg-white text-[#0F172A] rounded-2xl rounded-tl-xs border border-[#E2E8F0] shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0788C9] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0788C9] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0788C9] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Chat Input */}
              <ChatInput
                onSendMessage={(text) => sendMessage(text)}
                disabled={isTyping}
              />
            </>
          )}
        </div>
      )}

      {/* Floating Action Button (FAB) & Desktop Label */}
      <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 group">
        {/* Desktop "Aero AI" / "Close" Pill Label */}
        <button
          type="button"
          onClick={handleToggle}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-100 text-[13px] font-semibold tracking-tight shadow-[0_4px_12px_rgba(10,40,70,0.08)] group-hover:shadow-[0_6px_16px_rgba(10,40,70,0.14)] group-hover:-translate-x-0.5 transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0788C9]"
          aria-hidden="true"
          tabIndex={-1}
        >
          <span>{isOpen ? 'Close' : 'Aero AI'}</span>
          {!isOpen && (
            <Sparkles className="w-3.5 h-3.5 text-[#0788C9] fill-[#0788C9]/20" />
          )}
        </button>

        {/* Main Floating Button */}
        <div className="relative">
          {/* Subtle idle soft blue glow aura (motion-safe) */}
          {!isOpen && (
            <span
              className="absolute -inset-1 rounded-full bg-[#0788C9]/25 blur-[3px] -z-10 animate-pulse motion-reduce:hidden"
              aria-hidden="true"
            />
          )}

          <button
            type="button"
            onClick={handleToggle}
            className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full flex items-center justify-center bg-[#0788C9] hover:bg-[#0674ac] text-white border-2 border-white/95 dark:border-white/90 shadow-[0_8px_24px_rgba(10,40,70,0.22),0_2px_6px_rgba(10,40,70,0.12)] hover:shadow-[0_12px_28px_rgba(10,40,70,0.30),0_4px_10px_rgba(10,40,70,0.18)] hover:scale-105 active:scale-95 transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0788C9]/40 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
            aria-label={isOpen ? 'Close Aero AI Assistant' : 'Open Aero AI Assistant'}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white stroke-[2.5]" />
            ) : (
              <Sparkles className="w-6 h-6 text-white fill-white/20 stroke-[2.2] transition-transform duration-200 group-hover:scale-110" />
            )}
          </button>

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm animate-pulse motion-reduce:animate-none">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
