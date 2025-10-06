export interface User {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
  bio?: string;
  is_verified: boolean;
  created_at: string;
  avatar_url?: string;
  follower_count?: number;
  following_count?: number;
}

export interface Tweet {
  tweet_id: number;
  author_user_id: number;
  content: string;
  created_at: string;
  parent_tweet_id?: number;
  author?: User;
  likes_count?: number;
  retweets_count?: number;
  replies_count?: number;
  is_liked?: boolean;
  is_retweeted?: boolean;
  is_bookmarked?: boolean;
  media?: Media[];
}

export interface Media {
  media_id: number;
  tweet_id: number;
  media_url: string;
  media_type: 'image' | 'video' | 'gif';
}

export interface Notification {
  id: number;
  type: 'like' | 'retweet' | 'follow' | 'reply' | 'mention';
  user: User;
  tweet?: Tweet;
  created_at: string;
  read: boolean;
}

export interface DirectMessage {
  message_id: number;
  conversation_id: number;
  sender_user_id: number;
  content: string;
  sent_at: string;
  sender?: User;
}

export interface Conversation {
  conversation_id: number;
  participants: User[];
  last_message?: DirectMessage;
  created_at: string;
  last_message_at: string;
}
