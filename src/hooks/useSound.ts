import { useRef, useCallback, useEffect } from 'react';

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const oscillatorsRef = useRef<Map<string, OscillatorNode | AudioBufferSourceNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createNoiseBuffer = useCallback((type: 'white' | 'pink' | 'brown') => {
    const bufferSize = 2 * 44100;
    const buffer = getAudioContext().createBuffer(1, bufferSize, 44100);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'white') {
        output[i] = white * 0.5;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        output[i] = (b0 = (b0 + 0.02 * white) / 1.02) * 3.5;
      }
    }
    return buffer;
  }, []);

  const playNoise = useCallback((id: string, type: 'white' | 'pink' | 'brown' = 'pink', volume: number = 0.5) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const buffer = createNoiseBuffer(type);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(ctx.destination);
    source.connect(gainNode);
    source.start();

    oscillatorsRef.current.set(id, source);
    gainNodesRef.current.set(id, gainNode);

    return source;
  }, [getAudioContext, createNoiseBuffer]);

  const stopSound = useCallback((id: string) => {
    const oscillator = oscillatorsRef.current.get(id);
    if (oscillator) {
      try {
        (oscillator as OscillatorNode).stop?.();
        (oscillator as AudioBufferSourceNode).stop?.();
      } catch (e) {
        console.warn('Error stopping sound:', e);
      }
      oscillatorsRef.current.delete(id);
    }
    gainNodesRef.current.delete(id);
  }, []);

  const setVolume = useCallback((id: string, volume: number) => {
    const gainNode = gainNodesRef.current.get(id);
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    oscillatorsRef.current.forEach((_, id) => stopSound(id));
  }, [stopSound]);

  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  return {
    playNoise,
    stopSound,
    setVolume,
    stopAllSounds,
    getAudioContext,
  };
};
