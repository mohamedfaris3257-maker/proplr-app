'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getInitials, timeAgo } from '@/lib/utils';

interface Conversation {
  id: string;
  other_user: { name: string; photo_url: string | null } | null;
  other_user_id: string | null;
  last_message: { content: string; created_at: string; sender_id: string } | null;
  unread_count: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Props {
  currentUserId: string;
  currentUserName: string;
}

export function MessagingWidget({ currentUserId, currentUserName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'Focused' | 'Other'>('Focused');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initial = getInitials(currentUserName);

  /* ─── Fetch conversations ─────────────────────────────────────────── */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        setUnreadCount(data.conversations.filter((c: Conversation) => c.unread_count > 0).length);
      }
    } catch (err) {
      console.error('Conversations fetch error:', err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchConversations();
  }, [isOpen, fetchConversations]);

  /* ─── Fetch messages ──────────────────────────────────────────────── */
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/messages?conversation_id=${convId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error('Messages fetch error:', err);
    }
  }, []);

  useEffect(() => {
    if (activeConversation) fetchMessages(activeConversation);
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ─── Send message ────────────────────────────────────────────────── */
  async function sendMessage() {
    if (!newMessage.trim() || !activeConversation || sending) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic add
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: activeConversation,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: activeConversation, content }),
      });
      fetchMessages(activeConversation);
    } catch (err) {
      console.error('Send error:', err);
    }
    setSending(false);
  }

  /* ─── Data ────────────────────────────────────────────────────────── */
  const activeConvData = conversations.find((c) => c.id === activeConversation);
  const filtered = conversations.filter(
    (c) => !searchQuery || c.other_user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>

        {/* Messaging panel */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            bottom: 56,
            right: 0,
            width: 338,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            border: '0.5px solid rgba(0,0,0,0.15)',
            maxHeight: 520,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {activeConversation ? (
              /* ─── Active conversation thread ─── */
              <>
                {/* Header */}
                <div style={{ background: '#fff', padding: '10px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <button
                    onClick={() => { setActiveConversation(null); setMessages([]); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666', padding: '0 4px' }}
                  >
                    ←
                  </button>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                    {getInitials(activeConvData?.other_user?.name || '?')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#000' }}>
                      {activeConvData?.other_user?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 11, color: '#44c767', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#44c767' }} />
                      Active now
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f3f2ef', minHeight: 280, maxHeight: 340 }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#666', fontSize: 12, padding: 20 }}>
                      No messages yet. Say hello!
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
                        {!isMine && (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6e7591', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {getInitials(activeConvData?.other_user?.name || '?')}
                          </div>
                        )}
                        <div>
                          <div style={{
                            background: isMine ? '#3d9be9' : '#fff',
                            color: isMine ? '#fff' : '#000',
                            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            padding: '8px 12px',
                            fontSize: 13.5,
                            maxWidth: 200,
                            lineHeight: 1.4,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          }}>
                            {msg.content}
                          </div>
                          <div style={{ fontSize: 10.5, color: '#999', marginTop: 2, textAlign: isMine ? 'right' : 'left' }}>
                            {timeAgo(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '10px 12px', borderTop: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', gap: 8, alignItems: 'center', background: '#fff', flexShrink: 0 }}>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Write a message..."
                    style={{ flex: 1, border: '1px solid rgba(0,0,0,0.2)', borderRadius: 20, padding: '8px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#f3f2ef' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    style={{
                      background: newMessage.trim() ? '#3d9be9' : '#e0e0e0',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 34,
                      height: 34,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: newMessage.trim() ? 'pointer' : 'default',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    ➤
                  </button>
                </div>
              </>
            ) : (
              /* ─── Conversations list ─── */
              <>
                {/* Header */}
                <div style={{ padding: '12px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 16, color: '#000' }}>Messaging</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>✏️</button>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>⌄</button>
                  </div>
                </div>

                {/* Search */}
                <div style={{ padding: '8px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  <div style={{ background: '#f3f2ef', borderRadius: 4, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, color: '#666' }}>🔍</span>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search messages"
                      style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, background: 'transparent', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Focused / Other tabs */}
                <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  {(['Focused', 'Other'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                        fontSize: 13,
                        fontWeight: activeTab === tab ? 700 : 400,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        color: '#000',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Conversations list */}
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: 360 }}>
                  {filtered.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#666', fontSize: 13 }}>
                      No messages yet.
                      <br />
                      <span style={{ fontSize: 12 }}>Connect with someone to start chatting.</span>
                    </div>
                  ) : (
                    filtered.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversation(conv.id)}
                        style={{ display: 'flex', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#fff' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f3f2ef'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                      >
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#3d9be9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>
                            {getInitials(conv.other_user?.name || '?')}
                          </div>
                          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#44c767', border: '2px solid #fff' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: conv.unread_count > 0 ? 700 : 500, fontSize: 13.5, color: '#000' }}>
                              {conv.other_user?.name || 'Unknown'}
                            </span>
                            {conv.last_message?.created_at && (
                              <span style={{ fontSize: 11, color: '#666' }}>
                                {timeAgo(conv.last_message.created_at)}
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: 12.5,
                            color: conv.unread_count > 0 ? '#000' : '#666',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: conv.unread_count > 0 ? 600 : 400,
                          }}>
                            {conv.last_message?.content || 'No messages yet'}
                          </div>
                        </div>
                        {conv.unread_count > 0 && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3d9be9', marginTop: 6, flexShrink: 0 }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Floating chat button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#fff',
            border: '0.5px solid rgba(0,0,0,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            position: 'relative',
          }}
        >
          💬
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#e34a4a',
              color: '#fff',
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              border: '2px solid #fff',
            }}>
              {unreadCount}
            </div>
          )}
        </button>
      </div>
    </>
  );
}
