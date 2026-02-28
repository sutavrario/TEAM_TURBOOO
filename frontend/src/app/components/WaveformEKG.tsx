import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function WaveformEKG() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationId: number;
    let offset = 0;

    const drawWaveform = () => {
      if (!ctx || !canvas) return;
      
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create gradient for glow effect
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
      gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
      gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)');
      gradient.addColorStop(0.7, 'rgba(236, 72, 153, 0.8)');
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');

      // Outer glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();

      const points = 200;
      const spacing = width / points;

      for (let i = 0; i < points; i++) {
        const x = i * spacing;
        const progress = i / points;
        
        let y: number;

        // First third: Soundwave (sine wave pattern)
        if (progress < 0.35) {
          const localProgress = progress / 0.35;
          const frequency = 4;
          const amplitude = 30 * (1 - localProgress * 0.3);
          y = centerY + Math.sin((localProgress * frequency * Math.PI * 2) + offset) * amplitude;
        }
        // Transition zone
        else if (progress < 0.5) {
          const transitionProgress = (progress - 0.35) / 0.15;
          // Smooth transition from wave to flat
          const frequency = 4;
          const amplitude = 30 * (1 - 0.35 / 0.35 * 0.3) * (1 - transitionProgress);
          y = centerY + Math.sin((0.35 / 0.35 * frequency * Math.PI * 2) + offset) * amplitude;
        }
        // Second half: EKG heartbeat pattern
        else {
          const ekgProgress = (progress - 0.5) / 0.5;
          y = centerY + getEKGPoint(ekgProgress, offset);
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Inner bright line
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      offset += 0.02;
      animationId = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// EKG heartbeat pattern generator
function getEKGPoint(progress: number, offset: number): number {
  // Create a looping heartbeat pattern
  const cycle = (progress * 2 + offset * 0.5) % 1;
  
  if (cycle < 0.1) {
    // P wave (small bump)
    return Math.sin(cycle / 0.1 * Math.PI) * 8;
  } else if (cycle < 0.2) {
    // Flat before QRS
    return 0;
  } else if (cycle < 0.25) {
    // Q wave (small dip)
    return -Math.sin((cycle - 0.2) / 0.05 * Math.PI) * 10;
  } else if (cycle < 0.3) {
    // R wave (sharp spike)
    return Math.sin((cycle - 0.25) / 0.05 * Math.PI) * 60;
  } else if (cycle < 0.35) {
    // S wave (small dip)
    return -Math.sin((cycle - 0.3) / 0.05 * Math.PI) * 15;
  } else if (cycle < 0.5) {
    // ST segment (flat)
    return 0;
  } else if (cycle < 0.6) {
    // T wave (medium bump)
    return Math.sin((cycle - 0.5) / 0.1 * Math.PI) * 20;
  } else {
    // Baseline
    return 0;
  }
}
