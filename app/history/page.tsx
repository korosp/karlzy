'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Plus, Trash2, MessageSquare, ChevronLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const STORAGE_KEY = 'karlx-chats';

function loadChats(): Chat[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c: Chat) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      messages: c.messages.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch { return []; }
}

function saveChats(chats: Chat[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  return `${days} hari yang lalu`;
}

function groupChatsByDate(chats: Chat[]) {
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate()-1);
  const week = new Date(today); week.setDate(week.getDate()-7);
  const groups: { label: string; chats: Chat[] }[] = [
    { label: 'Hari Ini', chats: [] },
    { label: 'Kemarin', chats: [] },
    { label: '7 Hari Terakhir', chats: [] },
    { label: 'Lebih Lama', chats: [] },
  ];
  chats.forEach(c => {
    const d = new Date(c.createdAt); d.setHours(0,0,0,0);
    if (d >= today) groups[0].chats.push(c);
    else if (d >= yesterday) groups[1].chats.push(c);
    else if (d >= week) groups[2].chats.push(c);
    else groups[3].chats.push(c);
  });
  return groups.filter(g => g.chats.length > 0);
}

export default function HistoryPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setChats(loadChats());
  }, []);

  const filtered = query
    ? chats.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    : chats;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    saveChats(updated);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Chat Baru',
      messages: [],
      createdAt: new Date(),
    };
    const updated = [newChat, ...chats];
    saveChats(updated);
    router.push('/chat');
  };

  const handleOpen = (id: string) => {
    // Save active chat id ke localStorage lalu redirect
    localStorage.setItem('karlx-active-chat', id);
    router.push('/chat');
  };

  const groups = groupChatsByDate(filtered);

  return (
    <div className="min-h-screen bg-[#212121] text-white flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={() => router.push('/chat')}
          className="p-2 -ml-2 rounded-xl hover:bg-white/8 transition-colors text-white/60 hover:text-white">
          <ChevronLeft size={22} />
        </button>
        <Logo size="sm" />
        <div className="w-9" />
      </div>

      {/* Title */}
      <div className="px-5 mb-5">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Obrolan
        </h1>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#2a2a2a] border border-white/8">
          <Search size={16} className="text-[#8e8ea0] flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari Chat"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-[#ececec] placeholder:text-[#8e8ea0] font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#8e8ea0] hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 px-5 overflow-y-auto pb-32">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <MessageSquare size={40} className="text-[#8e8ea0]" />
            <p className="text-[#8e8ea0] text-sm">
              {query ? 'Chat tidak ditemukan' : 'Belum ada chat'}
            </p>
          </div>
        ) : query ? (
          // Flat list when searching
          <div className="space-y-1">
            {filtered.map(chat => (
              <ChatItem key={chat.id} chat={chat} onOpen={handleOpen} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          // Grouped list
          groups.map(group => (
            <div key={group.label} className="mb-6">
              <p className="text-xs text-[#8e8ea0] font-bold uppercase tracking-wider mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.chats.map(chat => (
                  <ChatItem key={chat.id} chat={chat} onOpen={handleOpen} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New chat FAB */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-5">
  <button
    onClick={handleNewChat}
    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
               font-bold text-white text-base
               bg-[#0B0B0B]
               shadow-[0_8px_30px_rgba(0,0,0,0.6)]
               hover:bg-[#111111]
               hover:shadow-[0_8px_40px_rgba(0,0,0,0.85)]
               transition-all duration-300 active:scale-95"
    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  >
    <Plus size={20} />
    Chat baru
  </button>
</div>

function ChatItem({ chat, onOpen, onDelete }: {
  chat: Chat;
  onOpen: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={() => onOpen(chat.id)}
      className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-white/5 active:bg-white/8 transition-colors cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
        <MessageSquare size={16} className="text-[#8e8ea0]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#ececec] truncate">{chat.title}</p>
        <p className="text-xs text-[#8e8ea0] mt-0.5">{timeAgo(chat.createdAt)}</p>
      </div>
      <button
        onClick={(e) => onDelete(chat.id, e)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-white/10 transition-all flex-shrink-0">
        <Trash2 size={14} className="text-[#8e8ea0]" />
      </button>
    </div>
  );
}
