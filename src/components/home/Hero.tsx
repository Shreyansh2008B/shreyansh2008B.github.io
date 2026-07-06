import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowDown,
  PlayCircle,
  Compass,
} from 'lucide-react';

const moodSuggestions: Record<string, string[]> = {
  happy: [
    'Wonderful! Keep that positive energy flowing.',
    'Try a gratitude journal entry to capture this moment.',
    'Share your joy with some relaxing music.',
  ],
  calm: [
    'Perfect time for a breathing exercise.',
    'Consider journaling your peaceful thoughts.',
    'Enjoy some gentle nature sounds.',
  ],
  sad: [
    'It\'s okay to feel this way. Try some calming music.',
    'A warm cup of tea and gentle rain sounds might help.',
    'Consider writing in your journal - expressing feelings helps.',
  ],
  anxious: [
    'Let\'s try some deep breathing together.',
    'The 4-7-8 breathing technique can help calm your nerves.',
    'Focus on the present moment with some meditation sounds.',
  ],
  angry: [
    'Take a moment to breathe deeply.',
    'Try box breathing to regain your calm.',
    'Physical activity or deep breathing can help release tension.',
  ],
  tired: [
    'Consider some sleep sounds for better rest.',
    'A short breathing session might refresh you.',
    'Pink noise can help with relaxation.',
  ],
};

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'from-primary-sky to-primary-mint' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: 'from-blue-400 to-blue-600' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-primary-lavender to-purple-600' },
  { id: 'angry', emoji: '😡', label: 'Angry', color: 'from-red-400 to-red-600' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'from-slate-400 to-slate-600' },
];

export const Hero: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (selectedMood) {
      const timer = setTimeout(() => setShowSuggestions(true), 300);
      return () => clearTimeout(timer);
    }
    setShowSuggestions(false);
  }, [selectedMood]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {moods.map((mood, index) => (
          <motion.div
            key={mood.id}
            className={`floating-orb w-64 h-64 bg-gradient-to-br ${mood.color} opacity-20`}
            style={{
              left: `${15 + index * 15}%`,
              top: `${20 + (index % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          />
        ))}
      </div>

      {/* Breathing orb */}
      <motion.div
        className="absolute w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-primary-sky/20 to-primary-lavender/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8 inline-block"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary-sky to-primary-lavender flex items-center justify-center shadow-glow-lg mx-auto">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="heading-xl text-dark dark:text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to{' '}
          <span className="text-gradient">ZenSpace</span>
        </motion.h1>

        <motion.p
          className="body-lg max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          A peaceful place where you can relax, breathe, focus, and recharge.
          <br />
          <span className="text-sm">Take care of your mind, one moment at a time.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/relax">
            <motion.button
              className="btn-primary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlayCircle className="w-5 h-5" />
              Start Relaxing
            </motion.button>
          </Link>
          <Link to="/breathe">
            <motion.button
              className="btn-secondary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Compass className="w-5 h-5" />
              Explore Features
            </motion.button>
          </Link>
        </motion.div>

        {/* Mood Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="heading-sm text-dark dark:text-white mb-6">How are you feeling?</h2>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                  selectedMood === mood.id
                    ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                    : 'glass hover:scale-105'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-3xl mb-1">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Suggestions */}
          <AnimatePresence>
            {selectedMood && showSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">
                      {moods.find(m => m.id === selectedMood)?.emoji}
                    </span>
                    <h3 className="font-poppins font-semibold text-dark dark:text-white">
                      Suggested for you
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {moodSuggestions[selectedMood]?.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-secondary dark:text-slate-300"
                      >
                        <Sparkles className="w-4 h-4 mt-1 text-primary-sky flex-shrink-0" />
                        {suggestion}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-secondary dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};
