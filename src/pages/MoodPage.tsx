import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Heart,
  LineChart,
  Smile,
  Frown,
  Meh,
  Angry,
  Zap,
  Star,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GlassCard } from '../components/ui/GlassCard';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  startOfDay,
} from 'date-fns';

interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

const moodOptions = [
  { id: 'amazing', label: 'Amazing', icon: Star, color: 'bg-yellow-400', emoji: '🌟' },
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-green-400', emoji: '😊' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-blue-400', emoji: '😐' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-indigo-400', emoji: '😔' },
  { id: 'anxious', label: 'Anxious', icon: Zap, color: 'bg-purple-400', emoji: '😰' },
  { id: 'angry', label: 'Angry', icon: Angry, color: 'bg-red-400', emoji: '😠' },
];

const moodScores: Record<string, number> = {
  amazing: 5,
  happy: 4,
  neutral: 3,
  sad: 2,
  anxious: 2,
  angry: 1,
};

const MoodPage: React.FC = () => {
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('zenspace-moods', []);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<string>('neutral');
  const [note, setNote] = useState('');

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getMoodForDate = (date: Date): MoodEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return moodEntries.find((entry) => entry.date === dateStr);
  };

  const getMoodOption = (moodId: string) => {
    return moodOptions.find((m) => m.id === moodId) || moodOptions[2];
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const entry = getMoodForDate(day);
    if (entry) {
      setSelectedMood(entry.mood);
      setNote(entry.note || '');
    } else {
      setSelectedMood('neutral');
      setNote('');
    }
  };

  const saveMood = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingIndex = moodEntries.findIndex((entry) => entry.date === dateStr);

    if (existingIndex >= 0) {
      const updated = [...moodEntries];
      updated[existingIndex] = { date: dateStr, mood: selectedMood, note };
      setMoodEntries(updated);
    } else {
      setMoodEntries([...moodEntries, { date: dateStr, mood: selectedMood, note }]);
    }
  };

  const weeklyStats = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return weekDays.map((day) => {
      const entry = getMoodForDate(day);
      return {
        day: format(day, 'EEE'),
        score: entry ? moodScores[entry.mood] ?? 0 : 0,
        mood: entry?.mood,
      };
    });
  }, [moodEntries]);

  const averageMoodScore = useMemo(() => {
    const scores = weeklyStats.map((d) => d.score).filter((s) => s > 0);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }, [weeklyStats]);

  const dominantMood = useMemo(() => {
    const counts: Record<string, number> = {};
    weeklyStats.forEach((day) => {
      if (day.mood) {
        counts[day.mood] = (counts[day.mood] || 0) + 1;
      }
    });
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }, [weeklyStats]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-lg text-dark dark:text-white mb-4">Mood Tracker</h1>
          <p className="body-md max-w-2xl mx-auto">
            Track your emotional journey over time. Understanding your patterns helps you take better care of yourself.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-poppins font-semibold text-dark dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary-sky" />
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-slate-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-secondary dark:text-slate-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 rounded-lg glass hover:bg-slate-100 dark:hover:bg-slate-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-5 h-5 text-secondary dark:text-slate-400" />
                  </motion.button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-secondary dark:text-slate-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const moodEntry = getMoodForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'ring-2 ring-primary-sky shadow-glow'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        className={`text-sm ${
                          isToday
                            ? 'font-bold text-primary-sky'
                            : 'text-dark dark:text-white'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      {moodEntry && (
                        <span className="text-lg mt-0.5">
                          {getMoodOption(moodEntry.mood).emoji}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Mood entry and stats */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Selected day mood */}
            <GlassCard>
              <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary-pink" />
                {format(selectedDate, 'EEEE, MMM d')}
              </h3>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {moodOptions.map((mood) => (
                  <motion.button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      selectedMood === mood.id
                        ? 'ring-2 ring-primary-sky bg-primary-sky/10'
                        : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs font-medium text-secondary dark:text-slate-400">
                      {mood.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about your day..."
                className="input-glass min-h-[80px] text-sm mb-4"
              />

              <motion.button
                onClick={saveMood}
                className="w-full btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Mood
              </motion.button>
            </GlassCard>

            {/* Weekly summary */}
            <GlassCard>
              <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary-mint" />
                This Week
              </h3>

              {/* Mood chart */}
              <div className="flex items-end justify-between h-24 mb-4 px-2">
                {weeklyStats.map((day, index) => {
                  const height = day.score > 0 ? (day.score / 5) * 100 : 10;
                  return (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <motion.div
                        className={`w-6 rounded-t transition-all ${
                          day.score > 0
                            ? 'bg-gradient-to-t from-primary-sky to-primary-lavender'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1 }}
                      />
                      <span className="text-xs text-secondary dark:text-slate-400">
                        {day.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary dark:text-slate-400">Average Score</span>
                  <span className="font-medium text-dark dark:text-white">
                    {averageMoodScore > 0 ? averageMoodScore.toFixed(1) : '—'}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary dark:text-slate-400">Dominant Mood</span>
                  <span>
                    {dominantMood ? (
                      <span className="flex items-center gap-1">
                        {getMoodOption(dominantMood).emoji}
                        <span className="text-dark dark:text-white">
                          {getMoodOption(dominantMood).label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-dark dark:text-white">—</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary dark:text-slate-400">Days Tracked</span>
                  <span className="font-medium text-dark dark:text-white">
                    {weeklyStats.filter((d) => d.score > 0).length}/7
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
