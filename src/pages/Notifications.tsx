import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Repeat2, UserPlus, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // TODO: Replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'like',
        user: {
          user_id: 2,
          username: 'techdev',
          email: 'tech@example.com',
          display_name: 'Tech Developer',
          is_verified: true,
          created_at: new Date().toISOString(),
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
        },
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
      },
      {
        id: 2,
        type: 'follow',
        user: {
          user_id: 3,
          username: 'designpro',
          email: 'design@example.com',
          display_name: 'Design Pro',
          is_verified: false,
          created_at: new Date().toISOString(),
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
        },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
      },
      {
        id: 3,
        type: 'retweet',
        user: {
          user_id: 4,
          username: 'codemaster',
          email: 'code@example.com',
          display_name: 'Code Master',
          is_verified: true,
          created_at: new Date().toISOString(),
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code',
        },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />;
      case 'retweet':
        return <Repeat2 className="w-8 h-8 text-green-500" />;
      case 'follow':
        return <UserPlus className="w-8 h-8 text-primary" />;
      case 'reply':
      case 'mention':
        return <MessageCircle className="w-8 h-8 text-primary" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your tweet';
      case 'retweet':
        return 'retweeted your tweet';
      case 'follow':
        return 'followed you';
      case 'reply':
        return 'replied to your tweet';
      case 'mention':
        return 'mentioned you in a tweet';
    }
  };

  return (
    <div className="flex-1 border-r border-border">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <h2 className="text-xl font-bold">Notifications</h2>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border-b border-border p-4 hover:bg-muted/50 transition-colors ${
              !notification.read ? 'bg-primary/5' : ''
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={notification.user.avatar_url} />
                    <AvatarFallback>{notification.user.display_name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <p className="text-sm">
                  <span className="font-bold">{notification.user.display_name}</span>
                  {' '}
                  <span className="text-muted-foreground">{getNotificationText(notification)}</span>
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>

                {notification.tweet && (
                  <div className="mt-2 p-3 border border-border rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.tweet.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Notifications;
