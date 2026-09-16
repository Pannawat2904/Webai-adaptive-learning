'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  MessageSquare,
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

function TutorChatContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const initialUnit = searchParams.get('unit');

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `สวัสดีครับน้อง **${profile.full_name}**! 👋 ครูคือ **AI HTML Tutor** ผู้ช่วยด้านการเรียนรู้โครงสร้างภาษา HTML สำหรับนักเรียน ปวช.\n\nสงสัยเรื่องแท็กใด ไม่เข้าใจ DOCTYPE, Heading, ลิงก์, ตาราง, ฟอร์ม หรือ Semantic HTML สามารถพิมพ์ถามครูได้ตลอดเวลาเลยครับ!`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQuestions = [
    '<!DOCTYPE html> มีความสำคัญอย่างไร?',
    'ความแตกต่างเชิง Semantic ระหว่าง <strong> กับ <b> คืออะไร?',
    'ทำไมแท็ก <img> ต้องใส่แอตทริบิวต์ alt เสมอ?',
    'เหตุใดจึงควรผูก <label for> คู่กับ <input id>?',
    'Semantic HTML5 อย่าง <header>, <main>, <nav> ช่วยเรื่องอะไร?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          currentUnit: initialUnit ? `หน่วย ${initialUnit}` : 'โครงสร้างภาษา HTML',
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'msg-reply-' + Date.now(),
        sender: 'assistant',
        text: data.reply || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: 'ขออภัยครับ ไม่สามารถเชื่อมต่อกับบริการ AI Tutor ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Header in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>ครูผู้ช่วย AI (AI HTML Tutor)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                ออนไลน์
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ผู้ช่วยตอบคำถามเฉพาะบุคคล เรื่อง โครงสร้างภาษา HTML (H1-H8) พร้อม Prompt Guard
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass text-[11px] font-semibold text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
          <span>ไม่เฉลยข้อสอบตรงๆ</span>
        </div>
      </div>

      {/* Chat Messages Container in Liquid Glass */}
      <div className="min-h-[460px] max-h-[560px] overflow-y-auto p-5 sm:p-7 rounded-3xl liquid-glass space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs shadow-md shadow-indigo-500/20'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-white/80 dark:border-white/5 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 text-xs text-slate-500 flex items-center gap-2 border border-white/80 dark:border-white/5 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>ครูกำลังคิดคำตอบและเตรียมตัวอย่างโค้ด HTML ให้ครับ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold px-1">
          คำถามที่พบบ่อย (คลิกเพื่อถามทันที):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3.5 py-1.5 rounded-full liquid-glass hover:text-indigo-600 font-semibold text-slate-700 dark:text-slate-300 transition-all hover:scale-105"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-3xl liquid-glass shadow-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถามเกี่ยวกับโครงสร้างภาษา HTML เช่น DOCTYPE, img, form, table..."
          className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all shrink-0"
        >
          <span>ส่งคำถาม</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

export default function StudentTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        </div>
      }
    >
      <TutorChatContent />
    </Suspense>
  );
}
