import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Circle, Hand, Leaf, X, RotateCcw } from 'lucide-react';

type GameType = 'bubbles' | 'sand' | 'zen' | 'leaves' | null;

const GamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-lg text-dark dark:text-white mb-4">Mini Games</h1>
          <p className="body-md max-w-2xl mx-auto">
            Relax with gentle, meditative games. No pressure, no score—just peaceful play.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!activeGame ? (
            /* Game selection */
            <motion.div
              key="selection"
              className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer h-full"
                  onClick={() => setActiveGame('bubbles')}
                >
                  <div className="text-center">
                    <Circle className="w-16 h-16 mx-auto mb-4 text-primary-sky" />
                    <h3 className="heading-sm text-dark dark:text-white mb-2">Bubble Pop</h3>
                    <p className="text-secondary dark:text-slate-400 text-sm">
                      Pop colorful floating bubbles with satisfying sounds
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer h-full"
                  onClick={() => setActiveGame('sand')}
                >
                  <div className="text-center">
                    <Hand className="w-16 h-16 mx-auto mb-4 text-primary-mint" />
                    <h3 className="heading-sm text-dark dark:text-white mb-2">Sand Drawing</h3>
                    <p className="text-secondary dark:text-slate-400 text-sm">
                      Draw patterns in the sand and watch them flow
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer h-full"
                  onClick={() => setActiveGame('zen')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-lavender to-primary-pink flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="heading-sm text-dark dark:text-white mb-2">Zen Garden</h3>
                    <p className="text-secondary dark:text-slate-400 text-sm">
                      Rake patterns in a peaceful zen garden
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard
                  hover
                  className="cursor-pointer h-full"
                  onClick={() => setActiveGame('leaves')}
                >
                  <div className="text-center">
                    <Leaf className="w-16 h-16 mx-auto mb-4 text-primary-lavender animate-float" />
                    <h3 className="heading-sm text-dark dark:text-white mb-2">Floating Leaves</h3>
                    <p className="text-secondary dark:text-slate-400 text-sm">
                      Watch leaves drift peacefully and guide them
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          ) : (
            /* Active game */
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Close button */}
              <div className="flex justify-end mb-4 gap-2">
                <motion.button
                  onClick={() => setActiveGame(null)}
                  className="p-2 rounded-lg glass"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-secondary dark:text-slate-400" />
                </motion.button>
              </div>

              {activeGame === 'bubbles' && <BubbleGame />}
              {activeGame === 'sand' && <SandGame />}
              {activeGame === 'zen' && <ZenGarden />}
              {activeGame === 'leaves' && <LeavesGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* Bubble Game */
const BubbleGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    vy: number;
  }>>([]);
  const [pops, setPops] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = ['#7DD3FC', '#A78BFA', '#6EE7B7', '#F9A8D4', '#FBBF24'];
    const spawnBubble = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setBubbles(prev => [
        ...prev.slice(-20),
        {
          id: Date.now() + Math.random(),
          x: Math.random() * (rect.width - 60) + 30,
          y: rect.height + 50,
          size: Math.random() * 40 + 30,
          color: colors[Math.floor(Math.random() * colors.length)],
          vy: -(Math.random() * 2 + 1),
        },
      ]);
    };

    const interval = setInterval(spawnBubble, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveBubbles = () => {
      setBubbles(prev =>
        prev
          .map(b => ({ ...b, y: b.y + b.vy }))
          .filter(b => b.y > -50)
      );
    };
    const interval = setInterval(moveBubbles, 16);
    return () => clearInterval(interval);
  }, []);

  const popBubble = useCallback((id: number, x: number, y: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    const popId = Date.now();
    setPops(prev => [...prev, { id: popId, x, y }]);
    setTimeout(() => setPops(prev => prev.filter(p => p.id !== popId)), 500);
  }, []);

  return (
    <GlassCard className="relative h-[500px] overflow-hidden">
      <div ref={containerRef} className="absolute inset-0">
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            className="absolute cursor-pointer"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const containerRect = containerRef.current?.getBoundingClientRect();
              if (containerRect) {
                popBubble(
                  bubble.id,
                  rect.left - containerRect.left + bubble.size / 2,
                  rect.top - containerRect.top + bubble.size / 2
                );
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, white 0%, ${bubble.color} 50%, ${bubble.color}99 100%)`,
                boxShadow: `0 0 20px ${bubble.color}50`,
              }}
            />
          </motion.div>
        ))}
        {pops.map(pop => (
          <motion.div
            key={pop.id}
            className="absolute pointer-events-none"
            style={{ left: pop.x - 20, top: pop.y - 20 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-white/50" />
          </motion.div>
        ))}
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-secondary dark:text-slate-400">
        Tap bubbles to pop them
      </p>
    </GlassCard>
  );
};

/* Sand Game */
const SandGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = '#F4E4BA';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = '#C2956E';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPos.current = { x, y };
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#F4E4BA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    lastPos.current = null;
  }, []);

  return (
    <GlassCard className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] cursor-pointer rounded-2xl touch-none"
        onMouseDown={(e) => {
          setIsDrawing(true);
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          }
        }}
        onMouseMove={draw}
        onMouseUp={() => {
          setIsDrawing(false);
          lastPos.current = null;
        }}
        onMouseLeave={() => {
          setIsDrawing(false);
          lastPos.current = null;
        }}
        onTouchStart={(e) => {
          setIsDrawing(true);
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            lastPos.current = {
              x: e.touches[0].clientX - rect.left,
              y: e.touches[0].clientY - rect.top,
            };
          }
        }}
        onTouchMove={draw}
        onTouchEnd={() => {
          setIsDrawing(false);
          lastPos.current = null;
        }}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <motion.button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-secondary dark:text-slate-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </motion.button>
      </div>
    </GlassCard>
  );
};

/* Zen Garden */
const ZenGarden: React.FC = () => {
  const [lines, setLines] = useState<Array<{ points: Array<{ x: number; y: number }>; rotation: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const rake = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rotation = lines.length * 15 + Math.random() * 10;

    const newPoints = [];
    for (let i = -100; i <= 100; i += 20) {
      newPoints.push({ x: x + i * 0.1, y: y + i + Math.sin(i * 0.05) * 5 });
    }

    setLines(prev => [...prev, { points: newPoints, rotation }]);
  }, [lines.length]);

  const clear = useCallback(() => setLines([]), []);

  return (
    <GlassCard className="relative">
      <div
        ref={containerRef}
        className="w-full h-[400px] bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl cursor-crosshair overflow-hidden"
        onMouseMove={(e) => {
          if (e.buttons === 1) rake(e);
        }}
        onTouchMove={rake}
      >
        <svg className="absolute inset-0 w-full h-full">
          {lines.map((line, i) => (
            <g key={i}>
              {line.points.map((point, j) => (
                <circle
                  key={j}
                  cx={point.x}
                  cy={point.y}
                  r="1.5"
                  fill="#8B7355"
                  opacity="0.4"
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Decorative stones */}
        <div className="absolute bottom-10 left-10 w-12 h-10 rounded-full bg-stone-400/60 shadow-lg" />
        <div className="absolute top-20 right-20 w-16 h-12 rounded-full bg-stone-500/60 shadow-lg" />
        <div className="absolute bottom-1/3 right-1/3 w-10 h-8 rounded-full bg-stone-400/60 shadow-lg" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <motion.button
          onClick={clear}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-secondary dark:text-slate-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Garden
        </motion.button>
      </div>
    </GlassCard>
  );
};

/* Leaves Game */
const LeavesGame: React.FC = () => {
  const [leaves, setLeaves] = useState<Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = ['#F9A8D4', '#A78BFA', '#FBBF24', '#6EE7B7', '#F87171'];
    const createLeaf = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setLeaves(prev =>
        prev.length > 15
          ? prev.slice(1)
          : [
              ...prev,
              {
                id: Date.now() + Math.random(),
                x: Math.random() * rect.width,
                y: -30,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 20 + 15,
              },
            ]
      );
    };

    const interval = setInterval(createLeaf, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fall = () => {
      setLeaves(prev =>
        prev
          .map(leaf => ({
            ...leaf,
            y: leaf.y + 1 + Math.random() * 0.5,
            x: leaf.x + Math.sin(leaf.y * 0.02) * 0.5,
            rotation: leaf.rotation + 0.5,
          }))
          .filter(leaf => leaf.y < 450)
      );
    };
    const interval = setInterval(fall, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="relative h-[500px] overflow-hidden bg-gradient-to-b from-primary-sky/10 to-primary-lavender/10 dark:from-primary-sky/5 dark:to-primary-lavender/5">
      <div ref={containerRef} className="absolute inset-0">
        {leaves.map(leaf => (
          <motion.div
            key={leaf.id}
            className="absolute cursor-pointer"
            style={{
              left: leaf.x,
              top: leaf.y,
              width: leaf.size,
              height: leaf.size,
            }}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={leaf.color}
              style={{
                width: '100%',
                height: '100%',
                transform: `rotate(${leaf.rotation}deg)`,
              }}
            >
              <path d="M12 2C8 6 4 12 4 18C4 20 6 22 12 22C18 22 20 20 20 18C20 12 16 6 12 2Z" />
            </svg>
          </motion.div>
        ))}
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-secondary dark:text-slate-400">
        Hover over leaves to interact
      </p>
    </GlassCard>
  );
};

export default GamesPage;
