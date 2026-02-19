'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Send, Plus, Trash2, Copy, Check, Code2, ImageIcon, X, ChevronLeft, ChevronRight, MessageSquare, PenSquare, HelpCircle, Mail, Github, Instagram } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { UserAvatar, AIAvatar } from '@/components/ui/Avatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="code-block">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hupl])(.+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);
}

function MessageBubble({ msg, onCopy }: { msg: Message; onCopy: (t: string) => void }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="flex-shrink-0 mt-1">
        {isUser ? <UserAvatar size={32} /> : <AIAvatar size={32} />}
      </div>
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-[#8e8ea0] font-semibold px-1">{isUser ? 'Kamu' : 'KarlX AI'}</span>
        {msg.image && <img src={msg.image} alt="uploaded" className="rounded-xl max-w-xs max-h-48 object-cover mb-1" />}
        <div className={`text-sm leading-7 rounded-2xl ${isUser ? 'bg-[#2f2f2f] px-4 py-3 text-[#ececec] rounded-tr-sm' : 'text-[#ececec] prose-ai'}`}>
          {isUser ? <p className="whitespace-pre-wrap">{msg.content}</p> : <div dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />}
        </div>
        {!isUser && (
          <button onClick={() => { onCopy(msg.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-1.5 text-xs text-[#8e8ea0] hover:text-white transition-colors px-1 mt-0.5">
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            {copied ? 'Disalin' : 'Salin'}
          </button>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex-shrink-0 mt-1"><AIAvatar size={32} /></div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#8e8ea0] font-semibold px-1">KarlX AI</span>
        <div className="flex items-center gap-1.5 py-2 px-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#8e8ea0] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
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

function createNewChat(): Chat {
  return { id: Date.now().toString(), title: 'Chat Baru', messages: [], createdAt: new Date() };
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

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<{ preview: string } | null>(null);
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = loadChats();
    const activeId = localStorage.getItem('karlx-active-chat');
    if (activeId) localStorage.removeItem('karlx-active-chat');
    if (stored.length > 0) {
      setChats(stored);
      const target = activeId ? stored.find(c => c.id === activeId) : null;
      setActiveChatId(target ? target.id : stored[0].id);
    } else {
      const first = createNewChat();
      setChats([first]);
      setActiveChatId(first.id);
    }
  }, []);

  useEffect(() => { if (chats.length > 0) saveChats(chats); }, [chats]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chats, loading, activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat?.messages ?? [];
  const isEmpty = messages.length === 0;

  const handleNewChat = () => {
    const chat = createNewChat();
    setChats(prev => [chat, ...prev]);
    setActiveChatId(chat.id);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (id === activeChatId) {
        if (updated.length > 0) setActiveChatId(updated[0].id);
        else { const chat = createNewChat(); setActiveChatId(chat.id); return [chat]; }
      }
      return updated;
    });
  };

  const updateMessages = useCallback((id: string, msgs: Message[]) => {
    setChats(prev => prev.map(c => {
      if (c.id !== id) return c;
      const firstUser = msgs.find(m => m.role === 'user');
      const title = firstUser ? firstUser.content.slice(0, 40) + (firstUser.content.length > 40 ? '...' : '') : c.title;
      return { ...c, messages: msgs, title };
    }));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage({ preview: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text && !image) return;
    if (loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, image: image?.preview, timestamp: new Date() };
    const updated = [...messages, userMsg];
    updateMessages(activeChatId, updated);
    setInput(''); setImage(null); setLoading(true);
    if (textRef.current) textRef.current.style.height = 'auto';
    try {
      const apiMessages = updated.map(m => ({
        role: m.role,
        content: m.image ? [{ type: 'image_url', image_url: { url: m.image } }, { type: 'text', text: m.content || 'Apa isi gambar ini?' }] : m.content,
      }));
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: apiMessages, model }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      updateMessages(activeChatId, [...updated, { id: (Date.now()+1).toString(), role: 'assistant', content: data.choices?.[0]?.message?.content ?? 'Maaf, tidak ada respons.', timestamp: new Date() }]);
    } catch (err: unknown) {
      updateMessages(activeChatId, [...updated, { id: (Date.now()+1).toString(), role: 'assistant', content: `⚠️ Gagal: ${err instanceof Error ? err.message : 'Unknown error'}`, timestamp: new Date() }]);
    } finally { setLoading(false); }
  }, [input, image, loading, messages, activeChatId, model, updateMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed md:relative top-0 left-0 h-full z-30 transition-all duration-300 flex flex-col bg-[#171717] border-r border-white/5 ${sidebarOpen ? 'w-72' : 'w-0'} overflow-hidden flex-shrink-0`}>
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <Logo size="sm" />
          <div className="flex items-center gap-1">
            <button onClick={handleNewChat} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white">
              <PenSquare size={14} />
            </button>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white">
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>

        <div className="px-3 pb-2 flex-shrink-0">
          <button onClick={handleNewChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm text-[#ececec] whitespace-nowrap font-medium">
            <Plus size={14} /> Chat Baru
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {groupChatsByDate(chats).map(group => (
            <div key={group.label} className="mb-3">
              <p className="text-xs text-[#8e8ea0] px-3 py-2 font-bold uppercase tracking-wider">{group.label}</p>
              {group.chats.map(chat => (
                <div key={chat.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors mb-0.5 ${chat.id === activeChatId ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  onClick={() => { setActiveChatId(chat.id); setSidebarOpen(false); }}>
                  <MessageSquare size={13} className="text-[#8e8ea0] flex-shrink-0" />
                  <span className="text-sm text-[#ececec] truncate flex-1">{chat.title}</span>
                  <button onClick={(e) => handleDeleteChat(chat.id, e)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all flex-shrink-0">
                    <Trash2 size={11} className="text-[#8e8ea0]" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom links */}
        <div className="flex-shrink-0 px-2 pb-4 pt-2 border-t border-white/5 space-y-0.5">
          <Link href="/faq" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-[#8e8ea0] hover:text-white whitespace-nowrap">
            <HelpCircle size={14} /> FAQ
          </Link>
          <Link href="/contact" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-[#8e8ea0] hover:text-white whitespace-nowrap">
            <Mail size={14} /> Kontak & Sosmed
          </Link>
          <a href="https://github.com/korosp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-[#8e8ea0] hover:text-white whitespace-nowrap">
            <Github size={14} /> GitHub Dev
          </a>
          <a href="https://www.instagram.com/kkarlzy_?igsh=MTB1bG5mMzh6NzFyZw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm text-[#8e8ea0] hover:text-white whitespace-nowrap">
            <Instagram size={14} /> Instagram Dev
          </a>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
          <Link href="/history" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white flex-shrink-0">
            <ChevronLeft size={18} />
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white flex-shrink-0">
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#ececec] truncate">{activeChat?.title ?? 'KarlX AI'}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-xs text-[#8e8ea0]">Online</span>
            </div>
          </div>
          <select value={model} onChange={e => setModel(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-white/10 bg-[#2f2f2f] text-[#8e8ea0] outline-none cursor-pointer font-mono flex-shrink-0 max-w-[140px]">
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
            <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
            <option value="gemma2-9b-it">Gemma2 9B</option>
          </select>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-4 pb-8">
              <Logo size="lg" />
              <h1 className="text-2xl font-bold text-[#ececec] text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Ada yang bisa saya bantu?
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
                {[
                  { icon: '💻', title: 'Debug Kode', text: 'Bantu debug kode Python saya' },
                  { icon: '✍️', title: 'Tulis Email', text: 'Tulis email profesional untuk klien' },
                  { icon: '🔍', title: 'Jelaskan Konsep', text: 'Jelaskan konsep machine learning' },
                  { icon: '📊', title: 'Analisis Data', text: 'Analisis data dan buat kesimpulan' },
                ].map(s => (
                  <button key={s.text} onClick={() => { setInput(s.text); textRef.current?.focus(); }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-white/8 bg-[#2a2a2a] hover:bg-[#333] transition-colors text-left">
                    <span className="text-xl flex-shrink-0">{s.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#ececec]">{s.title}</p>
                      <p className="text-xs text-[#8e8ea0] mt-0.5">{s.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} onCopy={t => navigator.clipboard.writeText(t).catch(() => {})} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} className="h-8" />
            </div>
          )}
        </div>

        <div className="px-4 pb-6 pt-2 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            {image && (
              <div className="mb-2 relative inline-block">
                <img src={image.preview} alt="preview" className="h-16 w-16 object-cover rounded-xl" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#555] rounded-full flex items-center justify-center">
                  <X size={10} className="text-white" />
                </button>
              </div>
            )}
            <div className="flex flex-col gap-2 p-3 rounded-2xl border border-white/10 bg-[#2a2a2a] focus-within:border-white/20 transition-colors">
              <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Pesan KarlX AI..." rows={1}
                className="bg-transparent outline-none resize-none text-sm leading-relaxed text-[#ececec] placeholder:text-[#8e8ea0] font-sans max-h-48"
                onInput={e => { const el = e.currentTarget; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 192) + 'px'; }} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white">
                    <ImageIcon size={17} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  <button onClick={() => setInput(v => v + '\n```\n\n```')} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white">
                    <Code2 size={17} />
                  </button>
                </div>
                <button onClick={handleSend} disabled={loading || (!input.trim() && !image)}
                  className={`p-2 rounded-lg transition-all duration-200 ${loading || (!input.trim() && !image) ? 'text-[#8e8ea0] cursor-not-allowed' : 'bg-white text-black hover:bg-white/90'}`}>
                  <Send size={15} />
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-[#8e8ea0] mt-2">KarlX AI bisa membuat kesalahan. Verifikasi info penting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
