import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Github,
  Twitter,
  Instagram,
  Heart,
  Shield,
  Mail,
} from 'lucide-react';

const footerLinks = {
  explore: [
    { label: 'Home', path: '/' },
    { label: 'Relax', path: '/relax' },
    { label: 'Breathe', path: '/breathe' },
    { label: 'Journal', path: '/journal' },
  ],
  resources: [
    { label: 'Sleep', path: '/sleep' },
    { label: 'Mood Tracker', path: '/mood' },
    { label: 'Games', path: '/games' },
    { label: 'Contact', path: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-32 text-primary-sky/10 dark:text-primary-sky/5"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C288,100,576,20,864,64 C1152,108,1344,32,1440,64 L1440,120 L0,120 Z"
            className="animate-wave"
          />
        </svg>
      </div>

      <div className="relative glass-nav border-t border-white/10 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-sky to-primary-lavender flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-poppins font-bold text-xl text-gradient">ZenSpace</span>
              </Link>
              <p className="text-secondary dark:text-slate-400 text-sm leading-relaxed mb-6">
                Your peaceful sanctuary for relaxation, mindfulness, and inner peace.
                Take a deep breath and let go.
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl glass dark:bg-slate-700/50 flex items-center justify-center text-secondary dark:text-slate-400 hover:text-primary-sky dark:hover:text-primary-sky transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4">Explore</h3>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-secondary dark:text-slate-400 hover:text-primary-sky dark:hover:text-primary-sky transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-secondary dark:text-slate-400 hover:text-primary-sky dark:hover:text-primary-sky transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-secondary dark:text-slate-400 hover:text-primary-sky dark:hover:text-primary-sky transition-colors text-sm flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-secondary dark:text-slate-400 hover:text-primary-sky dark:hover:text-primary-sky transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary dark:text-slate-400">
              © {new Date().getFullYear()} ZenSpace. All rights reserved.
            </p>
            <p className="text-sm text-secondary dark:text-slate-400 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary-pink animate-pulse" /> for your peace of mind
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
