import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Play, Pause, RotateCcw, Smartphone } from 'lucide-react';

type BreathingMode = 'box' | '4-7-8' | 'deep';

interface BreathingConfig {
  name: string;
  nameDisplay: string;
  description: string;
  phases: { name: string; duration: number }[];
}

const breathingModes: Record<BreathingMode, BreathingConfig> = {
  box: {
    name: 'Box Breathing',
    nameDisplay: '4-4-4-4',
    description: 'Equal breathing phases used by Navy SEALs to stay calm under pressure.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
  '4-7-8': {
    name: '4-7-8 Technique',
    nameDisplay: '4-7-8',
    description: 'A natural tranquilizer for the nervous system, great for sleep.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
  },
  deep: {
    name: 'Deep Calm',
    nameDisplay: '4-6',
    description: 'Simple deep breathing to reduce anxiety and promote relaxation.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale', duration: 6 },
    ],
  },
};

const BreathePage: React.FC = () => {
  const [mode, setMode] = useState<BreathingMode>('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = breathingModes[mode];
  const currentPhase = config.phases[phaseIndex];
  const totalDuration = config.phases.reduce((sum, p) => sum + p.duration, 0);
  const progress = currentPhase
    ? ((currentPhase.duration - countdown) / currentPhase.duration) * 100
    : 0;

  const vibrate = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setPhaseIndex(0);
    setCountdown(config.phases[0].duration);
    setCycles(0);
    vibrate();
  }, [config.phases, vibrate]);

  const stopBreathing = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetBreathing = useCallback(() => {
    stopBreathing();
    setPhaseIndex(0);
    setCountdown(config.phases[0].duration);
    setCycles(0);
  }, [stopBreathing, config.phases]);

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const nextPhaseIndex = (phaseIndex + 1) % config.phases.length;
          if (nextPhaseIndex === 0) {
            setCycles(c => c + 1);
          }
          vibrate();
          setPhaseIndex(nextPhaseIndex);
          return config.phases[nextPhaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, phaseIndex, config.phases, vibrate]);

  useEffect(() => {
    if (!isActive) {
      setCountdown(config.phases[0].duration);
      setPhaseIndex(0);
    }
  }, [mode, isActive, config.phases]);

  const getCircleScale = () => {
    if (!currentPhase) return 1;
    if (currentPhase.name === 'Inhale') return 1.3;
    if (currentPhase.name === 'Hold') return phaseIndex === 1 ? 1.3 : 1;
    return 0.7;
  };

  const getCircleColor = () => {
    if (!currentPhase) return 'from-primary-sky/30 to-primary-lavender/30';
    if (currentPhase.name === 'Inhale') return 'from-primary-sky/40 to-primary-lavender/40';
    if (currentPhase.name === 'Exhale') return 'from-primary-mint/40 to-primary-pink/40';
    return 'from-primary-lavender/30 to-primary-lavender/30';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-lg text-dark dark:text-white mb-4">
            Breathing Exercises
          </h1>
          <p className="body-md max-w-2xl mx-auto">
            Guided breathing techniques to help reduce stress, improve focus, and promote relaxation.
          </p>
        </motion.div>

        {/* Mode selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {(Object.keys(breathingModes) as BreathingMode[]).map((key) => (
            <motion.button
              key={key}
              onClick={() => {
                setMode(key);
                if (isActive) resetBreathing();
              }}
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                mode === key
                  ? 'bg-gradient-to-r from-primary-sky to-primary-lavender text-white shadow-lg'
                  : 'glass text-secondary dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="block font-poppins">{breathingModes[key].nameDisplay}</span>
              <span className="block text-xs opacity-80">{breathingModes[key].name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Breathing circle */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 w-72 h-72 md:w-80 md:h-80 rounded-full"
              animate={{
                boxShadow: isActive
                  ? [
                      '0 0 60px rgba(125, 211, 252, 0.3)',
                      '0 0 80px rgba(167, 139, 250, 0.4)',
                      '0 0 60px rgba(125, 211, 252, 0.3)',
                    ]
                  : '0 0 60px rgba(125, 211, 252, 0.2)',
              }}
              transition={{ duration: 4, repeat: isActive ? Infinity : 0 }}
            />

            {/* Main circle */}
            <motion.div
              className={`w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br ${getCircleColor()} flex flex-col items-center justify-center relative overflow-hidden`}
              animate={{
                scale: isActive ? getCircleScale() : 1,
              }}
              transition={{
                duration: currentPhase?.duration || 4,
                ease: 'easeInOut',
              }}
            >
              {/* Inner pattern */}
              <div className="absolute inset-4 rounded-full border border-white/20" />
              <div className="absolute inset-12 rounded-full border border-white/10" />

              {/* Content */}
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div
                    key={`${phaseIndex}-${countdown}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center z-10"
                  >
                    <motion.p
                      className="text-6xl md:text-7xl font-poppins font-bold text-dark dark:text-white"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {countdown}
                    </motion.p>
                    <p className="text-xl font-poppins text-secondary dark:text-slate-300 mt-2">
                      {currentPhase?.name}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center z-10"
                  >
                    <p className="text-2xl font-poppins text-secondary dark:text-slate-300">
                      Press start to begin
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Progress ring */}
            {isActive && (
              <svg className="absolute inset-0 w-72 h-72 md:w-80 md:h-80 -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-200 dark:text-slate-700"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>

          {/* Controls */}
          <motion.div
            className="flex items-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={isActive ? stopBreathing : startBreathing}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                  : 'bg-gradient-to-r from-primary-sky to-primary-lavender text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start
                </>
              )}
            </motion.button>

            {isActive && (
              <motion.button
                onClick={resetBreathing}
                className="p-4 rounded-xl glass text-secondary dark:text-slate-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>

          {/* Stats */}
          {isActive && (
            <motion.div
              className="flex items-center gap-6 mt-6 text-secondary dark:text-slate-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center">
                <p className="text-2xl font-poppins font-bold text-dark dark:text-white">
                  {cycles}
                </p>
                <p className="text-sm">Cycles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-poppins font-bold text-dark dark:text-white">
                  {Math.floor((cycles * totalDuration) / 60)}:{String((cycles * totalDuration) % 60).padStart(2, '0')}
                </p>
                <p className="text-sm">Total Time</p>
              </div>
            </motion.div>
          )}

          {/* Vibration indicator */}
          {'vibrate' in navigator && (
            <motion.div
              className="flex items-center gap-2 mt-4 text-xs text-secondary dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Smartphone className="w-4 h-4" />
              Vibration enabled
            </motion.div>
          )}
        </motion.div>

        {/* Mode description */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="text-center">
            <h3 className="font-poppins font-semibold text-dark dark:text-white mb-2">
              {config.name} - {config.nameDisplay}
            </h3>
            <p className="text-secondary dark:text-slate-400 text-sm">
              {config.description}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {config.phases.map((phase, index) => (
                <div key={index} className="text-center">
                  <p className="text-lg font-poppins font-bold text-dark dark:text-white">
                    {phase.duration}s
                  </p>
                  <p className="text-xs text-secondary dark:text-slate-400">
                    {phase.name}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default BreathePage;
