'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
  profiles?: { name: string; photo_url: string | null } | null;
}

interface Props {
  currentUserId: string;
  currentUserName: string;
}

export function MessagesPage({ currentUserId, currentUserName }: Props) {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch (err) {
      console.error('Conversations fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle ?user= param for starting new conversation
  useEffect(() => {
    const targetUser = searchParams.get('user');
    if (targetUser && conversations.length > 0) {
      const existing = conversations.find((c) => c.other_user_id === targetUser);
      if (existing) setActiveConv(existing.id);
    }
  }, [searchParams, conversations]);

  // Fetch messages for active conversation
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
    if (activeConv) {
      fetchMessages(activeConv);
    }
  }, [activeConv, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  async function handleSend() {
    if (!newMessage.trim() || sending) return;
    setSending(true);

    const targetUser = searchParams.get('user');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: activeConv,
          recipient_id: !activeConv ? targetUser : undefined,
          content: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
        if (!activeConv && data.conversation_id) {
          setActiveConv(data.conversation_id);
          fetchConversations(); // Refresh list
        }
      }
    } catch (err) {
      console.error('Send error:', err);
    }
    setSending(false);
  }

  const activeConvData = conversations.find((c) => c.id === activeConv);
  const filtered = conversations.filter((c) =>
    !searchQuery || c.other_user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flex: 1, background: '#fff', height: '100%' }}>
      {/* Conversations List */}
      <div style={s.convList}>
        <div style={s.convHeader}>
          <h2 style={s.convTitle}>Messages</h2>
        </div>
        <div style={{ padding: '0 12px 8px' }}>
          <input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={s.searchInput}
          />
        </div>

        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6e7591', fontSize: 13 }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6e7591', fontSize: 13 }}>
            {conversations.length === 0
              ? 'No conversations yet. Start one from the community page!'
              : 'No matching conversations.'}
          </div>
        ) : (
          filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              style={{
                ...s.convItem,
                background: activeConv === conv.id ? 'rgba(61,155,233,0.06)' : 'transparent',
              }}
            >
              <div style={s.convAvatar}>
                {getInitials(conv.other_user?.name || '?')}
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: conv.unread_count > 0 ? 700 : 500, color: '#071629' }}>
                    {conv.other_user?.name || 'Unknown'}
                  </span>
                  {conv.last_message && (
                    <span style={{ fontSize: 10.5, color: '#6e7591' }}>
                      {timeAgo(conv.last_message.created_at)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 12,
                    color: conv.unread_count > 0 ? '#071629' : '#6e7591',
                    fontWeight: conv.unread_count > 0 ? 500 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 200,
                  }}>
                    {conv.last_message?.content || 'No messages yet'}
                  </span>
                  {conv.unread_count > 0 && (
                    <span style={s.unreadBadge}>{conv.unread_count}</span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Message Thread */}
      <div style={s.threadPane}>
        {activeConv ? (
          <>
            {/* Thread header */}
            <div style={s.threadHeader}>
              <div style={s.convAvatar}>
                {getInitials(activeConvData?.other_user?.name || '?')}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#071629' }}>
                {activeConvData?.other_user?.name || 'Unknown'}
              </div>
            </div>

            {/* Messages */}
            <div style={s.messagesArea}>
              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '10px 14px',
                        borderRadius: isMine
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                        background: isMine ? '#3d9be9' : '#f0f2f8',
                        color: isMine ? '#fff' : '#1d1d1f',
                        fontSize: 13.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.content}
                      <div
                        style={{
                          fontSize: 10,
                          marginTop: 4,
                          opacity: 0.6,
                          textAlign: 'right' as const,
                        }}
                      >
                        {timeAgo(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={s.inputBar}>
              <input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={s.msgInput}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                style={{
                  ...s.sendBtn,
                  opacity: !newMessage.trim() || sending ? 0.5 : 1,
                }}
              >
                {sending ? '...' : 'Send'}
              </button>
            </div>
          </>
        ) : (
          <div style={s.emptyThread}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: '#071629', margin: '0 0 6px' }}>
              Your Messages
            </h3>
            <p style={{ fontSize: 13, color: '#6e7591', margin: 0, maxWidth: 300 }}>
              Select a conversation to start chatting, or message someone from their profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  convList: {
    width: 320,
    minWidth: 320,
    borderRight: '0.5px solid rgba(7,22,41,0.08)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
  },
  convHeader: {
    padding: '16px 16px 8px',
  },
  convTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: '#071629',
    margin: 0,
  },
  searchInput: {
    width: '100%',
    padding: '8px 14px',
    border: '0.5px solid rgba(7,22,41,0.12)',
    borderRadius: 100,
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    background: '#f0f2f8',
  },
  convItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    border: 'none',
    borderBottom: '0.5px solid rgba(7,22,41,0.05)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
    transition: 'background 0.15s',
  },
  convAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255,203,93,0.3), rgba(61,155,233,0.3))',
    color: '#b87d00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  unreadBadge: {
    background: '#3d9be9',
    color: '#fff',
    borderRadius: '50%',
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  threadPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  threadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 18px',
    borderBottom: '0.5px solid rgba(7,22,41,0.08)',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 18px',
  },
  inputBar: {
    display: 'flex',
    gap: 8,
    padding: '12px 18px',
    borderTop: '0.5px solid rgba(7,22,41,0.08)',
    background: '#fff',
  },
  msgInput: {
    flex: 1,
    padding: '10px 16px',
    border: '0.5px solid rgba(7,22,41,0.12)',
    borderRadius: 100,
    fontSize: 13.5,
    fontFamily: 'inherit',
    outline: 'none',
  },
  sendBtn: {
    background: '#3d9be9',
    color: '#fff',
    border: 'none',
    borderRadius: 100,
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  emptyThread: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6e7591',
  },
};
