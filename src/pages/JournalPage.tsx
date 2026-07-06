import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  Heart,
  Smile,
  Frown,
  Meh,
  Angry,
  Zap,
  Calendar,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GlassCard, GlassButton } from '../components/ui/GlassCard';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
}

interface GratitudeEntry {
  id: string;
  smile: string;
  grateful: string;
  lookingForward: string;
  createdAt: string;
}

type JournalTab = 'journal' | 'gratitude';

const moodOptions = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
  { id: 'calm', label: 'Calm', icon: Meh, color: 'text-primary-sky' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500' },
  { id: 'anxious', label: 'Anxious', icon: Zap, color: 'text-purple-500' },
  { id: 'angry', label: 'Angry', icon: Angry, color: 'text-red-500' },
  { id: 'love', label: 'Grateful', icon: Heart, color: 'text-pink-500' },
];

const JournalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<JournalTab>('journal');
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('zenspace-journal', []);
  const [gratitudeEntries, setGratitudeEntries] = useLocalStorage<GratitudeEntry[]>('zenspace-gratitude', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    mood: 'calm',
  });

  const [gratitudeForm, setGratitudeForm] = useState({
    smile: '',
    grateful: '',
    lookingForward: '',
  });

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

  const createEntry = () => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: editForm.title || 'Untitled',
      content: editForm.content,
      mood: editForm.mood,
      createdAt: now,
      updatedAt: now,
    };
    setEntries([newEntry, ...entries]);
    setEditForm({ title: '', content: '', mood: 'calm' });
    setIsCreating(false);
  };

  const updateEntry = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              title: editForm.title,
              content: editForm.content,
              mood: editForm.mood,
              updatedAt: new Date().toISOString(),
            }
          : entry
      )
    );
    setIsEditing(null);
    setEditForm({ title: '', content: '', mood: 'calm' });
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const startEdit = (entry: JournalEntry) => {
    setEditForm({ title: entry.title, content: entry.content, mood: entry.mood });
    setIsEditing(entry.id);
  };

  const createGratitudeEntry = () => {
    if (!gratitudeForm.smile && !gratitudeForm.grateful && !gratitudeForm.lookingForward) return;
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      ...gratitudeForm,
      createdAt: new Date().toISOString(),
    };
    setGratitudeEntries([newEntry, ...gratitudeEntries]);
    setGratitudeForm({ smile: '', grateful: '', lookingForward: '' });
  };

  const deleteGratitudeEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setGratitudeEntries(gratitudeEntries.filter((e) => e.id !== id));
    }
  };

  const getMoodIcon = (moodId: string) => {
    const mood = moodOptions.find((m) => m.id === moodId);
    return mood ? mood.icon : Meh;
  };

  const getMoodColor = (moodId: string) => {
    const mood = moodOptions.find((m) => m.id === moodId);
    return mood ? mood.color : 'text-slate-500';
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
          <h1 className="heading-lg text-dark dark:text-white mb-4">Journal</h1>
          <p className="body-md max-w-2xl mx-auto">
            Express your thoughts privately, track your mood, and practice gratitude.
            All entries are stored locally on your device.
          </p>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'journal'
                ? 'bg-gradient-to-r from-primary-sky to-primary-lavender text-white shadow-lg'
                : 'glass text-secondary dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="w-5 h-5" />
            Private Journal
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('gratitude')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'gratitude'
                ? 'bg-gradient-to-r from-primary-mint to-primary-pink text-white shadow-lg'
                : 'glass text-secondary dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5" />
            Gratitude
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'journal' ? (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Search and create */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass pl-12"
                  />
                </div>
                <GlassButton
                  variant="primary"
                  onClick={() => {
                    setEditForm({ title: '', content: '', mood: 'calm' });
                    setIsCreating(true);
                  }}
                >
                  <Plus className="w-5 h-5" />
                  New Entry
                </GlassButton>
              </div>

              {/* Create form */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <GlassCard>
                      <input
                        type="text"
                        placeholder="Title..."
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full text-xl font-poppins font-semibold bg-transparent border-none outline-none text-dark dark:text-white placeholder:text-secondary mb-4"
                      />
                      <textarea
                        placeholder="What's on your mind?"
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        className="w-full min-h-[150px] bg-transparent border-none outline-none resize-none text-dark dark:text-white placeholder:text-secondary"
                      />
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className="text-sm text-secondary dark:text-slate-400">Mood:</span>
                        {moodOptions.map((mood) => (
                          <button
                            key={mood.id}
                            onClick={() => setEditForm({ ...editForm, mood: mood.id })}
                            className={`p-2 rounded-lg transition-all ${
                              editForm.mood === mood.id
                                ? 'bg-primary-sky/20 ring-2 ring-primary-sky'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <mood.icon className={`w-5 h-5 ${mood.color}`} />
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <GlassButton variant="ghost" onClick={() => setIsCreating(false)}>
                          <X className="w-4 h-4" />
                          Cancel
                        </GlassButton>
                        <GlassButton variant="primary" onClick={createEntry}>
                          <Save className="w-4 h-4" />
                          Save
                        </GlassButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Entries list */}
              <div className="space-y-4">
                {filteredEntries.length === 0 ? (
                  <GlassCard className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-secondary dark:text-slate-400 mb-4" />
                    <p className="text-secondary dark:text-slate-400">No journal entries yet.</p>
                    <p className="text-sm text-secondary dark:text-slate-400 mt-1">
                      Start writing to capture your thoughts.
                    </p>
                  </GlassCard>
                ) : (
                  filteredEntries.map((entry) => {
                    const MoodIcon = getMoodIcon(entry.mood);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <GlassCard hover className="relative">
                          {isEditing === entry.id ? (
                            <>
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full text-xl font-poppins font-semibold bg-transparent border-none outline-none text-dark dark:text-white mb-4"
                              />
                              <textarea
                                value={editForm.content}
                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                className="w-full min-h-[150px] bg-transparent border-none outline-none resize-none text-dark dark:text-white"
                              />
                              <div className="flex flex-wrap items-center gap-2 mt-4">
                                <span className="text-sm text-secondary dark:text-slate-400">Mood:</span>
                                {moodOptions.map((mood) => (
                                  <button
                                    key={mood.id}
                                    onClick={() => setEditForm({ ...editForm, mood: mood.id })}
                                    className={`p-2 rounded-lg transition-all ${
                                      editForm.mood === mood.id
                                        ? 'bg-primary-sky/20 ring-2 ring-primary-sky'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                  >
                                    <mood.icon className={`w-5 h-5 ${mood.color}`} />
                                  </button>
                                ))}
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <GlassButton variant="ghost" onClick={() => setIsEditing(null)}>
                                  Cancel
                                </GlassButton>
                                <GlassButton variant="primary" onClick={() => updateEntry(entry.id)}>
                                  Save
                                </GlassButton>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <MoodIcon className={`w-6 h-6 ${getMoodColor(entry.mood)}`} />
                                  <div>
                                    <h3 className="font-poppins font-semibold text-dark dark:text-white">
                                      {entry.title}
                                    </h3>
                                    <p className="text-xs text-secondary dark:text-slate-400 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEdit(entry)}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-secondary dark:text-slate-400 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-secondary dark:text-slate-300 text-sm whitespace-pre-wrap">
                                {entry.content}
                              </p>
                            </>
                          )}
                        </GlassCard>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gratitude"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* New gratitude form */}
              <GlassCard className="mb-6">
                <h3 className="font-poppins font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary-pink" />
                  Today's Gratitude Journal
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      What made you smile today?
                    </label>
                    <textarea
                      value={gratitudeForm.smile}
                      onChange={(e) => setGratitudeForm({ ...gratitudeForm, smile: e.target.value })}
                      className="input-glass min-h-[80px]"
                      placeholder="A small moment of joy..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      What are you grateful for?
                    </label>
                    <textarea
                      value={gratitudeForm.grateful}
                      onChange={(e) => setGratitudeForm({ ...gratitudeForm, grateful: e.target.value })}
                      className="input-glass min-h-[80px]"
                      placeholder="Someone or something you appreciate..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                      What are you looking forward to?
                    </label>
                    <textarea
                      value={gratitudeForm.lookingForward}
                      onChange={(e) => setGratitudeForm({ ...gratitudeForm, lookingForward: e.target.value })}
                      className="input-glass min-h-[80px]"
                      placeholder="Something that excites you..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <GlassButton variant="primary" onClick={createGratitudeEntry}>
                      <Save className="w-4 h-4" />
                      Save Entry
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>

              {/* Past gratitude entries */}
              <div className="space-y-4">
                <h3 className="font-poppins font-semibold text-dark dark:text-white">
                  Past Entries
                </h3>

                {gratitudeEntries.length === 0 ? (
                  <GlassCard className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto text-primary-pink mb-4" />
                    <p className="text-secondary dark:text-slate-400">No gratitude entries yet.</p>
                    <p className="text-sm text-secondary dark:text-slate-400 mt-1">
                      Start practicing gratitude today.
                    </p>
                  </GlassCard>
                ) : (
                  gratitudeEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      layout
                    >
                      <GlassCard hover className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-secondary dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(entry.createdAt), 'EEEE, MMMM d, yyyy')}
                          </p>
                          <button
                            onClick={() => deleteGratitudeEntry(entry.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {entry.smile && (
                            <div>
                              <p className="text-xs font-medium text-primary-sky mb-1">Made me smile:</p>
                              <p className="text-secondary dark:text-slate-300 text-sm">{entry.smile}</p>
                            </div>
                          )}
                          {entry.grateful && (
                            <div>
                              <p className="text-xs font-medium text-primary-mint mb-1">Grateful for:</p>
                              <p className="text-secondary dark:text-slate-300 text-sm">{entry.grateful}</p>
                            </div>
                          )}
                          {entry.lookingForward && (
                            <div>
                              <p className="text-xs font-medium text-primary-lavender mb-1">Looking forward to:</p>
                              <p className="text-secondary dark:text-slate-300 text-sm">{entry.lookingForward}</p>
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalPage;
