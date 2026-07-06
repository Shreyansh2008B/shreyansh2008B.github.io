import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Wind,
  Music,
  BookOpen,
  Moon,
  Heart,
  Mail,
  Menu,
  X,
  Sun,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/relax', label: 'Relax', icon: Music },
  { path: '/breathe', label: 'Breathe', icon: Wind },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/sleep', label: 'Sleep', icon: Moon },
  { path: '/mood', label: 'Mood', icon: Heart },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-nav shadow-lg py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-sky to-primary-lavender flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-poppins font-bold text-xl text-gradient hidden sm:block">
                ZenSpace
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link key={path} to={path}>
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-sky/20 to-primary-lavender/20 text-primary-sky dark:text-primary-sky'
                          : 'text-secondary dark:text-slate-300 hover:bg-primary-sky/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl glass dark:bg-slate-700/50 hover:scale-110 transition-transform"
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-primary-lavender" />
                )}
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl glass dark:bg-slate-700/50"
                whileTap={{ scale: 0.9 }}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-dark dark:text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 glass-nav z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4">
                  <span className="font-poppins font-bold text-xl text-gradient">Menu</span>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-dark dark:text-white" />
                  </motion.button>
                </div>

                <nav className="flex-1 px-4 py-2">
                  {navItems.map(({ path, label, icon: Icon }, index) => {
                    const isActive = location.pathname === path;
                    return (
                      <motion.div
                        key={path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl my-1 transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-sky/20 to-primary-lavender/20 text-primary-sky'
                              : 'text-secondary dark:text-slate-300 hover:bg-primary-sky/10'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-secondary dark:text-slate-300 hover:bg-primary-sky/10 transition-colors"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};
