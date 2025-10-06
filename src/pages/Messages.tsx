import { useState, useEffect } from 'react';
import { Conversation, DirectMessage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    // TODO: Replace with actual API call
    const mockConversations: Conversation[] = [
      {
        conversation_id: 1,
        participants: [
          {
            user_id: 2,
            username: 'techdev',
            email: 'tech@example.com',
            display_name: 'Tech Developer',
            is_verified: true,
            created_at: new Date().toISOString(),
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
          },
        ],
        last_message: {
          message_id: 1,
          conversation_id: 1,
          sender_user_id: 2,
          content: 'Hey! How are you?',
          sent_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        created_at: new Date().toISOString(),
        last_message_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ];

    setConversations(mockConversations);
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // TODO: Fetch messages for this conversation
    const mockMessages: DirectMessage[] = [
      {
        message_id: 1,
        conversation_id: conversation.conversation_id,
        sender_user_id: 2,
        content: 'Hey! How are you?',
        sent_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sender: conversation.participants[0],
      },
      {
        message_id: 2,
        conversation_id: conversation.conversation_id,
        sender_user_id: 1,
        content: "I'm good! Thanks for asking 😊",
        sent_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // TODO: API call to send message
    setNewMessage('');
  };

  return (
    <div className="flex-1 border-r border-border flex h-screen">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <header className="p-4 border-b border-border">
          <h2 className="text-xl font-bold">Messages</h2>
        </header>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.conversation_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => selectConversation(conversation)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.conversation_id === conversation.conversation_id
                  ? 'bg-muted'
                  : ''
              }`}
            >
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={conversation.participants[0].avatar_url} />
                  <AvatarFallback>{conversation.participants[0].display_name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-bold">{conversation.participants[0].display_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {conversation.last_message &&
                        formatDistanceToNow(new Date(conversation.last_message.sent_at), {
                          addSuffix: false,
                        })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message?.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <header className="p-4 border-b border-border flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedConversation.participants[0].avatar_url} />
              <AvatarFallback>{selectedConversation.participants[0].display_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{selectedConversation.participants[0].display_name}</p>
              <p className="text-sm text-muted-foreground">
                @{selectedConversation.participants[0].username}
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.message_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender_user_id === 1 ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl ${
                    message.sender_user_id === 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Start a new message"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
