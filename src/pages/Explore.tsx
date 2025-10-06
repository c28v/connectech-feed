import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTopics = [
    { rank: 1, topic: '#ReactJS', tweets: '125K' },
    { rank: 2, topic: '#TypeScript', tweets: '89K' },
    { rank: 3, topic: '#WebDevelopment', tweets: '67K' },
    { rank: 4, topic: '#AI', tweets: '234K' },
    { rank: 5, topic: '#Python', tweets: '156K' },
  ];

  return (
    <div className="flex-1 border-r border-border">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Linkup"
            className="pl-11"
          />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 space-y-4"
      >
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-4">Trending Now</h2>
            <div className="space-y-4">
              {trendingTopics.map((trend) => (
                <motion.div
                  key={trend.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: trend.rank * 0.1 }}
                  className="flex items-start justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{trend.rank}</Badge>
                      <span className="text-sm text-muted-foreground">Trending</span>
                    </div>
                    <p className="font-bold text-lg">{trend.topic}</p>
                    <p className="text-sm text-muted-foreground">{trend.tweets} tweets</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Explore;
