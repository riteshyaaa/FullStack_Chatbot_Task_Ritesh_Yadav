import React from 'react';
import { QuickReply } from '../../types';

interface QuickRepliesListProps {
  quickReplies: QuickReply[];
  onSelect: (qr: QuickReply) => void;
  disabled?: boolean;
}

export const QuickRepliesList: React.FC<QuickRepliesListProps> = ({
  quickReplies,
  onSelect,
  disabled = false,
}) => {
  if (!quickReplies || quickReplies.length === 0) return null;

  return (
    <div className="py-2.5 px-3.5 flex gap-1.5 overflow-x-auto no-scrollbar mask-fade bg-[#F8FAFC]">
      {quickReplies.map((qr) => (
        <button
          key={qr.id}
          disabled={disabled}
          onClick={() => onSelect(qr)}
          className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#0788C9] hover:text-white hover:border-[#0788C9] text-[#0F172A] border border-[#CBD5E1] transition-all duration-200 font-medium disabled:opacity-40 cursor-pointer shadow-[0_1px_3px_rgba(15,23,42,0.06)] active:scale-95"
        >
          {qr.label}
        </button>
      ))}
    </div>
  );
};
