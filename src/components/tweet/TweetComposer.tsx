import { useState } from 'react';
import { Image, Smile, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface TweetComposerProps {
  onTweetPosted?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const TweetComposer = ({ onTweetPosted, placeholder = "What's happening?", autoFocus }: TweetComposerProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const maxLength = 280;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      // TODO: Replace with actual API call to your Flask backend
      // await axios.post('http://localhost:5000/api/tweets', { content });
      
      console.log('Posting tweet:', content);
      setContent('');
      onTweetPosted?.();
    } catch (error) {
      console.error('Failed to post tweet:', error);
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.display_name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-lg p-0"
            autoFocus={autoFocus}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Image className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Calendar className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <MapPin className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remainingChars}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isOverLimit}
                className="rounded-full px-6 font-bold"
              >
                Tweet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;
