import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { User, Tweet } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TweetCard from '@/components/tweet/TweetCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserTweets();
  }, [username]);

  const fetchUserProfile = async () => {
    // TODO: Replace with actual API call
    const mockUser: User = {
      user_id: 1,
      username: username || 'demo_user',
      email: 'user@example.com',
      display_name: 'Demo User',
      bio: '🚀 Full-stack developer | 💻 React & TypeScript enthusiast | 🎨 Design lover',
      is_verified: true,
      created_at: new Date('2023-01-15').toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      follower_count: 1234,
      following_count: 567,
    };
    setUser(mockUser);
  };

  const fetchUserTweets = async () => {
    // TODO: Replace with actual API call
    const mockTweets: Tweet[] = [
      {
        tweet_id: 1,
        author_user_id: 1,
        content: 'Just pushed a major update to my project! Check it out 🎉',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        likes_count: 45,
        retweets_count: 12,
        replies_count: 8,
      },
    ];
    setTweets(mockTweets);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex-1 border-r border-border">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <h2 className="text-xl font-bold">{user.display_name}</h2>
        <p className="text-sm text-muted-foreground">{tweets.length} tweets</p>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Cover Image */}
        <div className="h-48 bg-gradient-primary"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-3xl">{user.display_name[0]}</AvatarFallback>
            </Avatar>

            <Button
              variant={isFollowing ? 'outline' : 'default'}
              onClick={handleFollow}
              className="mt-16"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {user.display_name}
                {user.is_verified && (
                  <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                )}
              </h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {user.bio && <p className="text-foreground">{user.bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <span className="font-bold text-foreground">{user.following_count}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-foreground">{user.follower_count}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tweets Tabs */}
        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="w-full h-14 rounded-none bg-transparent border-b border-border">
            <TabsTrigger
              value="tweets"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Tweets
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Replies
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Media
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tweets" className="mt-0">
            {tweets.map((tweet) => (
              <TweetCard key={tweet.tweet_id} tweet={{ ...tweet, author: user }} />
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Profile;
