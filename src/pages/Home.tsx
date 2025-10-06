import { useEffect, useState } from 'react';
import { Tweet } from '@/types';
import TweetCard from '@/components/tweet/TweetCard';
import TweetComposer from '@/components/tweet/TweetComposer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const Home = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    fetchTweets();
  }, [activeTab]);

  const fetchTweets = async () => {
    try {
      // TODO: Replace with actual API call to your Flask backend
      // const response = await axios.get('http://localhost:5000/api/tweets/feed');
      // setTweets(response.data);

      // Mock data for demo
      const mockTweets: Tweet[] = [
        {
          tweet_id: 1,
          author_user_id: 1,
          content: 'Just launched my new project! 🚀 Built with React, TypeScript, and Flask. Check it out!',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          author: {
            user_id: 1,
            username: 'techdev',
            email: 'tech@example.com',
            display_name: 'Tech Developer',
            bio: 'Full-stack developer',
            is_verified: true,
            created_at: new Date().toISOString(),
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
          },
          likes_count: 42,
          retweets_count: 8,
          replies_count: 5,
          is_liked: false,
          is_retweeted: false,
          is_bookmarked: false,
        },
        {
          tweet_id: 2,
          author_user_id: 2,
          content: 'Amazing tutorial on TypeScript generics! 💯\n\nLearning so much today. #TypeScript #WebDev',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          author: {
            user_id: 2,
            username: 'codemaster',
            email: 'code@example.com',
            display_name: 'Code Master',
            bio: 'Software Engineer | Open Source Contributor',
            is_verified: false,
            created_at: new Date().toISOString(),
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code',
          },
          likes_count: 156,
          retweets_count: 23,
          replies_count: 12,
          is_liked: true,
          is_retweeted: false,
          is_bookmarked: true,
        },
        {
          tweet_id: 3,
          author_user_id: 3,
          content: 'Hot take: Tailwind CSS is the best thing that happened to frontend development in the last 5 years. Fight me! 😤',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          author: {
            user_id: 3,
            username: 'designpro',
            email: 'design@example.com',
            display_name: 'Design Pro',
            bio: 'UI/UX Designer & Frontend Developer',
            is_verified: true,
            created_at: new Date().toISOString(),
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
          },
          likes_count: 89,
          retweets_count: 15,
          replies_count: 47,
          is_liked: false,
          is_retweeted: false,
          is_bookmarked: false,
        },
      ];

      setTweets(mockTweets);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
  };

  return (
    <div className="flex-1 border-r border-border">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-14 rounded-none bg-transparent border-0">
            <TabsTrigger
              value="for-you"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <TweetComposer onTweetPosted={fetchTweets} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {tweets.map((tweet) => (
          <TweetCard key={tweet.tweet_id} tweet={tweet} />
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
