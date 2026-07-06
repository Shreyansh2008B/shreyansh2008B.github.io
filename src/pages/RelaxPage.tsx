import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CloudRain,
  Waves,
  Trees,
  Flame,
  Wind,
  Bird,
  Music,
  Volume2,
  VolumeX,
  Pause,
  Play,
} from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { GlassCard } from '../components/ui/GlassCard';

interface Sound {
  id: string;
  name: string;
  icon: React.ElementType;
  type: 'pink' | 'brown' | 'white';
  frequency?: number;
}

const sounds: Sound[] = [
  { id: 'rain', name: 'Rain', icon: CloudRain, type: 'pink' },
  { id: 'ocean', name: 'Ocean', icon: Waves, type: 'brown' },
  { id: 'forest', name: 'Forest', icon: Trees, type: 'pink' },
  { id: 'fireplace', name: 'Fireplace', icon: Flame, type: 'brown' },
  { id: 'wind', name: 'Wind', icon: Wind, type: 'brown' },
  { id: 'birds', name: 'Birds', icon: Bird, type: 'white' },
  { id: 'piano', name: 'Piano', icon: Music, type: 'white' },
];

const RelaxPage: React.FC = () => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const { playNoise, stopSound, setVolume, stopAllSounds } = useSound();

  const toggleSound = useCallback((sound: Sound) => {
    const isActive = activeSounds.has(sound.id);

    if (isActive) {
      stopSound(sound.id);
      setActiveSounds(prev => {
        const next = new Set(prev);
        next.delete(sound.id);
        return next;
      });
    } else {
      const volume = volumes[sound.id] ?? 0.5;
      playNoise(sound.id, sound.type, volume);
      setActiveSounds(prev => new Set(prev).add(sound.id));
      if (volumes[sound.id] === undefined) {
        setVolumes(prev => ({ ...prev, [sound.id]: 0.5 }));
      }
    }
  }, [activeSounds, volumes, playNoise, stopSound]);

  const handleVolumeChange = useCallback((soundId: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: volume }));
    if (activeSounds.has(soundId)) {
      setVolume(soundId, volume);
    }
  }, [activeSounds, setVolume]);

  const stopAll = useCallback(() => {
    stopAllSounds();
    setActiveSounds(new Set());
  }, [stopAllSounds]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-lg text-dark dark:text-white mb-4">
            Ambient Sound Mixer
          </h1>
          <p className="body-md max-w-2xl mx-auto">
            Mix multiple sounds together to create your perfect relaxing atmosphere.
            Each sound can be adjusted independently.
          </p>
        </motion.div>

        {/* Global controls */}
        {activeSounds.size > 0 && (
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.button
              onClick={stopAll}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <VolumeX className="w-5 h-5" />
              Stop All Sounds
            </motion.button>
          </motion.div>
        )}

        {/* Sound grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sounds.map((sound, index) => {
            const isActive = activeSounds.has(sound.id);
            const volume = volumes[sound.id] ?? 0.5;

            return (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  hover
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isActive ? 'ring-2 ring-primary-sky shadow-glow' : ''
                  }`}
                >
                  {/* Background gradient when active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary-sky/10 to-primary-lavender/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Sound header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-br from-primary-sky to-primary-lavender text-white shadow-lg'
                              : 'bg-slate-100 dark:bg-slate-700/50 text-secondary dark:text-slate-400'
                          }`}
                          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                        >
                          <sound.icon className="w-6 h-6" />
                        </motion.div>
                        <div>
                          <h3 className="font-poppins font-semibold text-dark dark:text-white">
                            {sound.name}
                          </h3>
                          <p className="text-xs text-secondary dark:text-slate-400">
                            {isActive ? 'Playing' : 'Tap to play'}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => toggleSound(sound)}
                        className={`p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary-sky text-white'
                            : 'bg-slate-100 dark:bg-slate-700/50 text-secondary dark:text-slate-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isActive ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>

                    {/* Volume slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary dark:text-slate-400 flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          Volume
                        </span>
                        <span className="text-secondary dark:text-slate-400">
                          {Math.round(volume * 100)}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary-sky to-primary-lavender"
                            style={{ width: `${volume * 100}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Tips */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="text-center">
            <h3 className="font-poppins font-semibold text-dark dark:text-white mb-2">
              Tips for Best Experience
            </h3>
            <ul className="text-secondary dark:text-slate-400 text-sm space-y-1">
              <li>Combine 2-3 sounds for the most natural atmosphere</li>
              <li>Use headphones for an immersive experience</li>
              <li>Adjust volumes to find your perfect balance</li>
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default RelaxPage;
