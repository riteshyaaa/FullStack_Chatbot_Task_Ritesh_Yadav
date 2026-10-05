import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, QuickReply } from '../../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onQuickReplyClick: (qr: QuickReply) => void;
  onOpenEnquiryModal?: (serviceInterest?: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onQuickReplyClick,
  onOpenEnquiryModal,
}) => {
  const isBot = message.sender === 'bot';

  // Simple Markdown renderer for bold, lists, and linebreaks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      // Bold formatter: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-bold text-[#0F172A]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Render list items
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li key={lineIndex} className="ml-4 list-disc list-outside my-0.5 text-[#334155]">
            {formattedLine}
          </li>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={lineIndex} className="ml-1 my-1 flex gap-1.5 text-[#334155]">
            <span className="font-bold text-[#0788C9]">{line.trim().match(/^\d+\./)?.[0]}</span>
            <span>{parts.slice(1).length > 0 ? formattedLine : line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }

      return (
        <p key={lineIndex} className={lineIndex > 0 && line.trim() ? 'mt-1.5' : ''}>
          {formattedLine}
        </p>
      );
    });
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(message.timestamp);

  return (
    <div
      className={`flex items-start gap-2.5 my-2.5 ${
        isBot ? 'justify-start' : 'justify-end flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs ${
          isBot
            ? 'bg-[#0788C9] text-white'
            : 'bg-[#0F172A] text-white'
        }`}
      >
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[85%] sm:max-w-[80%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed transition-all ${
            isBot
              ? 'bg-white text-[#0F172A] rounded-tl-xs border border-[#E2E8F0] shadow-[0_2px_8px_rgba(15,23,42,0.06)]'
              : 'bg-[#0788C9] text-white rounded-tr-xs shadow-sm font-medium'
          }`}
        >
          <div className="space-y-1">{renderFormattedText(message.text)}</div>

          {/* Quick Lead Form CTA inside bot bubble */}
          {isBot && message.isEnquiryPrompt && (
            <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-[#475569]">
                Ready to submit an official enquiry or quote request?
              </span>
              <button
                type="button"
                onClick={() => onOpenEnquiryModal?.()}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-xs transition-all duration-200 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Quick Enquiry Form</span>
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[#64748B] mt-1 px-1 font-medium">{formattedTime}</span>

        {/* Dynamic Follow-up Quick Reply chips */}
        {isBot && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-full">
            {message.quickReplies.map((qr) => (
              <button
                key={qr.id}
                type="button"
                onClick={() => onQuickReplyClick(qr)}
                className="text-xs px-3 py-1.5 rounded-full bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#0788C9] hover:text-white hover:border-[#0788C9] shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:shadow-sm font-medium transition-all duration-200 text-left cursor-pointer active:scale-95"
              >
                {qr.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
