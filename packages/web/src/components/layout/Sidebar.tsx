import { NavLink } from 'react-router-dom';
import { Home, Compass, BookOpen, Mic, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { HelpButton } from '@/components/ui/HelpButton';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/discover', icon: Compass, label: 'Trends' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/voice-training', icon: Mic, label: 'Voice' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[60px] bg-cream border-r-3 border-deep-black flex-col items-center py-4 z-50">
        <div className="mb-8">
          <img src="/logo.svg" alt="Quirk" className="h-10 w-auto" />
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
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

        <div className="flex flex-col gap-2">
          <HelpButton />
          <button
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center rounded-button text-charcoal hover:bg-cream transition-all duration-150"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-cream border-t-3 border-deep-black flex items-center justify-around z-50 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-button transition-all duration-150 ${
                isActive
                  ? 'bg-coral text-soft-white'
                  : 'text-charcoal hover:bg-cream'
              }`
            }
          >
            <Icon size={20} />
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-button text-charcoal hover:bg-cream transition-all duration-150"
          aria-label="Sign out"
        >
          <LogOut size={20} />
        </button>
      </nav>
    </>
  );
}
