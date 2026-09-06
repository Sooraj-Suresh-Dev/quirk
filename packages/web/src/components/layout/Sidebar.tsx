import { NavLink } from 'react-router-dom';
import { Home, Compass, BookOpen, Mic, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/voice', icon: Mic, label: 'Voice' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] bg-cream border-r-3 border-deep-black flex flex-col items-center py-4 z-50">
      <div className="mb-8">
        <img src="/logo.svg" alt="Quirk" className="h-11 w-auto" />
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-button transition-all duration-150 ${
                isActive
                  ? 'bg-coral text-soft-white'
                  : 'text-charcoal hover:bg-cream'
              }`
            }
            title={label}
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="w-10 h-10 flex items-center justify-center rounded-button text-charcoal hover:bg-cream transition-all duration-150"
        title="Sign out"
      >
        <LogOut size={20} />
      </button>
    </aside>
  );
}
