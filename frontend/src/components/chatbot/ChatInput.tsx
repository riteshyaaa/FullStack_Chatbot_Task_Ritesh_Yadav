import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your question (e.g., pilot courses, surveying quote)...',
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 sm:p-3.5 border-t border-[#E2E8F0] bg-white flex items-center gap-2 shrink-0"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={300}
          className="w-full px-3.5 py-2.5 bg-white text-[#0F172A] placeholder:text-[#94A3B8] text-xs sm:text-[13px] rounded-xl border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0788C9]/30 focus:border-[#0788C9] transition-all disabled:opacity-50 shadow-xs"
        />
        {text.length > 200 && (
          <span className="absolute right-2.5 bottom-2 text-[10px] text-[#64748B]">
            {300 - text.length}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="w-10 h-10 rounded-xl bg-[#0788C9] hover:bg-[#0674ac] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:hover:bg-[#0788C9] transition-all duration-200 shadow-sm cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0788C9]/40"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
