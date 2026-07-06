import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Music,
  Wind,
  BookOpen,
  Moon,
  Heart,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Music,
    title: 'Relax Sounds',
    description: 'Mix ambient sounds like rain, ocean, and forest to create your perfect calming atmosphere.',
    path: '/relax',
    color: 'from-primary-sky to-blue-500',
  },
  {
    icon: Wind,
    title: 'Breathing Exercises',
    description: 'Guided breathing techniques including Box Breathing and 4-7-8 to reduce stress.',
    path: '/breathe',
    color: 'from-primary-lavender to-purple-500',
  },
  {
    icon: BookOpen,
    title: 'Journal',
    description: 'Express your thoughts privately with mood tags and the ability to export your entries.',
    path: '/journal',
    color: 'from-primary-mint to-green-500',
  },
  {
    icon: Moon,
    title: 'Sleep Mode',
    description: 'Drift off with white noise, pink noise, and rain sounds with a sleep timer.',
    path: '/sleep',
    color: 'from-slate-400 to-slate-600',
  },
  {
    icon: Heart,
    title: 'Mood Tracker',
    description: 'Track your emotional journey with a beautiful calendar view and weekly insights.',
    path: '/mood',
    color: 'from-primary-pink to-rose-500',
  },
  {
    icon: Gamepad2,
    title: 'Mini Games',
    description: 'Relax with gentle games like bubble popping, sand drawing, and zen garden.',
    path: '/games',
    color: 'from-amber-400 to-orange-500',
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-dark dark:text-white mb-4">
            Tools for Your Peace
          </h2>
          <p className="body-md max-w-2xl mx-auto">
            Discover a collection of features designed to help you find calm, clarity, and inner peace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={feature.path}>
                <motion.div
                  className="h-full glass-card-hover p-6 group cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="heading-sm text-dark dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary-sky opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
