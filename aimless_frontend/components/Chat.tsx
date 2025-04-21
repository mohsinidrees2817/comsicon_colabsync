'use client';

import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useGlobalContext } from '@/context/Globalcontext';

const BACKEND_URL = 'http://localhost:8000/api/messages';

interface Message {
    id: string;
    project_id: string;
    sender: string;
    content: string;
    inserted_at: string;
}

interface ChatProps {
    projectId: string;
}

export default function Chat({ projectId }: ChatProps) {
    const { userdetails } = useGlobalContext();
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const chatRef = useRef<HTMLDivElement>(null);

    const sender = userdetails?.username || 'Unknown';

    const fetchInitialMessages = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/history?project_id=${projectId}`);
            if (!res.ok) throw new Error('Network response was not ok');

            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const sendMessage = async () => {
        if (!sender.trim() || !content.trim()) return;

        try {
            await fetch(`${BACKEND_URL}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: projectId, sender, content }),
            });
            setContent('');
            fetchInitialMessages();
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    useEffect(() => {
        fetchInitialMessages();

        const channel = supabase
            .channel('realtime:messages')
            .on<Message>(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    if (payload.new.project_id === projectId) {
                        setMessages((prev) => [...prev, payload.new]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="border rounded-lg shadow-sm bg-white flex flex-col h-[500px]">
            <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                ref={chatRef}
            >
                {messages.length === 0 ? (
                    <p className="text-sm text-gray-500">No messages yet.</p>
                ) : (
                    messages.map((msg) => {
                        const isCurrentUser = msg.sender === sender;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-xs text-sm ${isCurrentUser
                                        ? 'bg-indigo-100 text-indigo-900'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p className="font-semibold text-xs mb-1 flex items-center gap-1">
                                        <span className="inline-block size-2.5 bg-indigo-600 rounded-full"></span>
                                        {msg.sender}
                                    </p>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form
                className="p-3 border-t flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <input
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    placeholder="Type your message..."
                    value={content}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-500"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
