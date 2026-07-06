import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';

const quotes = [
  { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha' },
  { text: 'The greatest weapon against stress is our ability to choose one thought over another.', author: 'William James' },
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'Breathe. It\'s just a bad day, not a bad life.', author: 'Unknown' },
  { text: 'In the midst of movement and chaos, keep stillness inside of you.', author: 'Deepak Chopra' },
  { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
  { text: 'The time to relax is when you don\'t have time for it.', author: 'Sydney J. Harris' },
  { text: 'Your calm mind is the ultimate weapon against your challenges.', author: 'Bryant McGill' },
  { text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.', author: 'Thich Nhat Hanh' },
  { text: 'For fast-acting relief, try slowing down.', author: 'Lily Tomlin' },
  { text: 'Quiet the mind, and the soul will speak.', author: 'Ma Jaya Sati Bhagavati' },
  { text: 'Happiness is not something ready-made. It comes from your own actions.', author: 'Dalai Lama' },
  { text: 'Within you, there is a stillness and a sanctuary to which you can retreat at any time.', author: 'Hermann Hesse' },
  { text: 'The greatest way to achieve inner peace is to accept what is.', author: 'Unknown' },
  { text: 'Take rest; a field that has rested gives a beautiful crop.', author: 'Ovid' },
];

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<typeof quotes[0] | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return quotes[dayOfYear % quotes.length];
  };

  const getRandomQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === quote && quotes.length > 1);
    return newQuote;
  };

  useEffect(() => {
    setQuote(getDailyQuote());
  }, []);

  const refreshQuote = () => {
    setIsRotating(true);
    setQuote(getRandomQuote());
    setTimeout(() => setIsRotating(false), 500);
  };

  if (!quote) return null;

  return (
    <motion.section
      className="py-20 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-sky/20 to-primary-lavender/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-mint/20 to-primary-pink/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-sky to-primary-lavender flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Quote className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={quote.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="quote-text mb-6 leading-relaxed px-4">
                  "{quote.text}"
                </p>
                <p className="font-poppins text-primary-sky dark:text-primary-sky">
                  — {quote.author}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={refreshQuote}
              className="mt-8 p-3 rounded-xl glass hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw
                className={`w-5 h-5 text-secondary dark:text-slate-400 ${isRotating ? 'animate-spin' : ''}`}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
