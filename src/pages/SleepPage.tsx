import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Timer,
  Volume2,
  Play,
  Pause,
  Power,
  CloudRain,
  Wind,
  Radio,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { GlassCard } from '../components/ui/GlassCard';

type SleepSound = 'white' | 'pink' | 'brown' | 'rain';
type TimerOption = number | null;

interface SleepSoundOption {
  id: SleepSound;
  name: string;
  icon: React.ElementType;
  description: string;
}

const sleepSounds: SleepSoundOption[] = [
  { id: 'white', name: 'White Noise', icon: Radio, description: 'Equal intensity across all frequencies, like static' },
  { id: 'pink', name: 'Pink Noise', icon: Sparkles, description: 'Deeper and softer, like steady rain' },
  { id: 'brown', name: 'Brown Noise', icon: Wind, description: 'Low rumble, like a distant waterfall' },
  { id: 'rain', name: 'Rain Sounds', icon: CloudRain, description: 'Gentle rainfall for deep sleep' },
];

const timerOptions: { value: TimerOption; label: string }[] = [
  { value: null, label: 'No Timer' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
];

const SleepPage: React.FC = () => {
  const [activeSound, setActiveSound] = useState<SleepSound | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [timer, setTimer] = useState<TimerOption>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isDimmed, setIsDimmed] = useState(false);

  const { playNoise, stopSound, setVolume: setSoundVolume, stopAllSounds } = useSound();

  const toggleSound = useCallback((soundId: SleepSound) => {
    if (activeSound === soundId) {
      stopSound(soundId);
      setActiveSound(null);
      setTimeRemaining(null);
    } else {
      if (activeSound) {
        stopSound(activeSound);
      }
      playNoise(soundId, soundId === 'rain' ? 'pink' : soundId, volume);
      setActiveSound(soundId);
      if (timer) {
        setTimeRemaining(timer * 60);
      }
    }
  }, [activeSound, timer, volume, playNoise, stopSound]);

  useEffect(() => {
    if (activeSound) {
      setSoundVolume(activeSound, volume);
    }
  }, [volume, activeSound, setSoundVolume]);

  useEffect(() => {
    if (!timeRemaining || !activeSound) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          stopAllSounds();
          setActiveSound(null);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, activeSound, stopAllSounds]);

  useEffect(() => {
    if (timer && activeSound) {
      setTimeRemaining(timer * 60);
    } else if (!timer) {
      setTimeRemaining(null);
    }
  }, [timer, activeSound]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stopAll = useCallback(() => {
    stopAllSounds();
    setActiveSound(null);
    setTimeRemaining(null);
  }, [stopAllSounds]);

  const exitDimMode = () => {
    setIsDimmed(false);
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-all duration-1000 ${
        isDimmed ? 'bg-black' : ''
      }`}
      onClick={isDimmed ? exitDimMode : undefined}
    >
      <div className={`max-w-4xl mx-auto transition-opacity duration-500 ${isDimmed ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg"
            animate={{
              rotate: [0, 360],
              scale: activeSound ? [1, 1.05, 1] : 1,
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: activeSound ? Infinity : 0 },
            }}
          >
            <Moon className="w-10 h-10 text-primary-sky" />
          </motion.div>
          <h1 className="heading-lg text-dark dark:text-white mb-4">Sleep Mode</h1>
          <p className="body-md max-w-2xl mx-auto">
            Drift into peaceful sleep with soothing sounds and a gentle timer.
            Let the night embrace you.
          </p>
        </motion.div>

        {/* Timer display */}
        {timeRemaining && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="inline-block px-8 py-4">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-primary-sky" />
                <span className="text-2xl font-poppins font-bold text-dark dark:text-white">
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-secondary dark:text-slate-400">remaining</span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Sound options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {sleepSounds.map((sound, index) => {
            const isActive = activeSound === sound.id;
            return (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hover
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive ? 'ring-2 ring-primary-sky shadow-glow' : ''
                  }`}
                  onClick={() => toggleSound(sound.id)}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-primary-sky'
                          : 'bg-slate-100 dark:bg-slate-700/50 text-secondary dark:text-slate-400'
                      }`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 3, repeat: isActive ? Infinity : 0 }}
                    >
                      <sound.icon className="w-7 h-7" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-poppins font-semibold text-dark dark:text-white">
                        {sound.name}
                      </h3>
                      <p className="text-sm text-secondary dark:text-slate-400">
                        {sound.description}
                      </p>
                    </div>
                    <motion.button
                      className={`p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary-sky text-white'
                          : 'bg-slate-100 dark:bg-slate-700/50 text-secondary dark:text-slate-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Volume control */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5 text-secondary dark:text-slate-400" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary dark:text-slate-400">Volume</span>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-slate-500 to-slate-700"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Timer options */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary-sky" />
              Sleep Timer
            </h3>
            <div className="flex flex-wrap gap-2">
              {timerOptions.map((option) => (
                <motion.button
                  key={option.label}
                  onClick={() => setTimer(option.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    timer === option.value
                      ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-secondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {activeSound && (
            <motion.button
              onClick={stopAll}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Power className="w-5 h-5" />
              Stop All
            </motion.button>
          )}
          <motion.button
            onClick={() => setIsDimmed(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Moon className="w-5 h-5" />
            Dim Screen
          </motion.button>
        </motion.div>

        {/* Tips */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="text-center">
            <h3 className="font-poppins font-semibold text-dark dark:text-white mb-2">
              Sleep Tips
            </h3>
            <ul className="text-secondary dark:text-slate-400 text-sm space-y-1">
              <li>Pink and brown noise are best for deep sleep</li>
              <li>Set a timer to save battery and sleep well</li>
              <li>Keep volume low (around 30-50%) for comfort</li>
              <li>Use dim mode to reduce screen light at night</li>
            </ul>
          </GlassCard>
        </motion.div>
      </div>

      {/* Dim mode overlay */}
      <AnimatePresence>
        {isDimmed && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Moon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 text-sm">Tap anywhere to exit dim mode</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SleepPage;
