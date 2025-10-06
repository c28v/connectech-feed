import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bell, Mail, User, Settings, LogOut, Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sticky top-0 h-screen w-64 border-r border-border p-4 hidden lg:flex flex-col"
    >
      <div className="flex items-center gap-2 mb-8 px-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Feather className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Linkup</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-4 text-lg"
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="space-y-2">
        <Link to="/compose">
          <Button className="w-full gap-2 text-lg font-semibold shadow-primary">
            <Feather className="w-5 h-5" />
            Tweet
          </Button>
        </Link>

        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-4 text-lg text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
