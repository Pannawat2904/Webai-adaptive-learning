'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Send,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  Terminal,
  Code2
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
    'ความแตกต่างระหว่าง <strong> กับ <b> คืออะไร?',
    'ทำไม <img> ต้องมีแอตทริบิวต์ alt เสมอ?',
    'ทำไมควรผูก <label for> คู่กับ <input id>?',
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
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col font-sans">
      
      {/* Container */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Mac OS Style Header */}
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            
            <div className="flex bg-slate-800 rounded-lg p-1">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-md text-blue-400 text-xs font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>AI HTML Tutor (Online)</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-[11px] font-bold text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span>Prompt Guard Active</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/50 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            
            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center border-2 ${
                    isUser
                      ? 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      : 'bg-blue-600 border-blue-700 text-white'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-5 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-800 text-white rounded-2xl rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-blue-700 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-slate-500">กำลังประมวลผลคำตอบ...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-3"
          >
            <div className="flex-1 relative">
              <div className="absolute top-3 left-3 text-slate-400">
                <Code2 className="w-5 h-5" />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="พิมพ์คำถามเกี่ยวกับ HTML ที่นี่... (กด Enter เพื่อส่ง)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                rows={2}
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white transition-colors shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function StudentTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <TutorChatContent />
    </Suspense>
  );
}
