
import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
}

interface Blueprint {
  name: string;
  lines: Line[];
}

const AnimatedArchitecturalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const currentBlueprintIndex = useRef(0);
  const currentLineIndex = useRef(0);
  const lineProgress = useRef(0);
  const fadeProgress = useRef(0);
  const phase = useRef<'drawing' | 'displaying' | 'fading'>('drawing');
  const phaseStartTime = useRef(0);
  const gradientOffset = useRef(0);

  // Define architectural blueprints
  const blueprints: Blueprint[] = [
    {
      name: 'Modern House',
      lines: [
        // House base
        { start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
        { start: { x: 0.2, y: 0.7 }, end: { x: 0.2, y: 0.4 } },
        { start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.4 } },
        // Roof
        { start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.2 } },
        { start: { x: 0.5, y: 0.2 }, end: { x: 0.8, y: 0.4 } },
        // Door
        { start: { x: 0.45, y: 0.7 }, end: { x: 0.45, y: 0.55 } },
        { start: { x: 0.45, y: 0.55 }, end: { x: 0.55, y: 0.55 } },
        { start: { x: 0.55, y: 0.55 }, end: { x: 0.55, y: 0.7 } },
        // Windows
        { start: { x: 0.25, y: 0.5 }, end: { x: 0.35, y: 0.5 } },
        { start: { x: 0.25, y: 0.5 }, end: { x: 0.25, y: 0.6 } },
        { start: { x: 0.35, y: 0.5 }, end: { x: 0.35, y: 0.6 } },
        { start: { x: 0.25, y: 0.6 }, end: { x: 0.35, y: 0.6 } },
      ]
    },
    {
      name: 'Building',
      lines: [
        // Main structure
        { start: { x: 0.3, y: 0.8 }, end: { x: 0.3, y: 0.2 } },
        { start: { x: 0.7, y: 0.8 }, end: { x: 0.7, y: 0.2 } },
        { start: { x: 0.3, y: 0.2 }, end: { x: 0.7, y: 0.2 } },
        { start: { x: 0.3, y: 0.8 }, end: { x: 0.7, y: 0.8 } },
        // Floor divisions
        { start: { x: 0.3, y: 0.35 }, end: { x: 0.7, y: 0.35 } },
        { start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
        { start: { x: 0.3, y: 0.65 }, end: { x: 0.7, y: 0.65 } },
        // Windows - floor 1
        { start: { x: 0.35, y: 0.25 }, end: { x: 0.42, y: 0.25 } },
        { start: { x: 0.35, y: 0.25 }, end: { x: 0.35, y: 0.32 } },
        { start: { x: 0.42, y: 0.25 }, end: { x: 0.42, y: 0.32 } },
        { start: { x: 0.35, y: 0.32 }, end: { x: 0.42, y: 0.32 } },
        { start: { x: 0.58, y: 0.25 }, end: { x: 0.65, y: 0.25 } },
        { start: { x: 0.58, y: 0.25 }, end: { x: 0.58, y: 0.32 } },
        { start: { x: 0.65, y: 0.25 }, end: { x: 0.65, y: 0.32 } },
        { start: { x: 0.58, y: 0.32 }, end: { x: 0.65, y: 0.32 } },
      ]
    },
    {
      name: 'Monument',
      lines: [
        // Base
        { start: { x: 0.25, y: 0.8 }, end: { x: 0.75, y: 0.8 } },
        { start: { x: 0.25, y: 0.8 }, end: { x: 0.25, y: 0.75 } },
        { start: { x: 0.75, y: 0.8 }, end: { x: 0.75, y: 0.75 } },
        { start: { x: 0.25, y: 0.75 }, end: { x: 0.75, y: 0.75 } },
        // Columns
        { start: { x: 0.35, y: 0.75 }, end: { x: 0.35, y: 0.3 } },
        { start: { x: 0.45, y: 0.75 }, end: { x: 0.45, y: 0.3 } },
        { start: { x: 0.55, y: 0.75 }, end: { x: 0.55, y: 0.3 } },
        { start: { x: 0.65, y: 0.75 }, end: { x: 0.65, y: 0.3 } },
        // Top
        { start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
        { start: { x: 0.3, y: 0.3 }, end: { x: 0.3, y: 0.25 } },
        { start: { x: 0.7, y: 0.3 }, end: { x: 0.7, y: 0.25 } },
        { start: { x: 0.3, y: 0.25 }, end: { x: 0.7, y: 0.25 } },
        // Triangular pediment
        { start: { x: 0.3, y: 0.25 }, end: { x: 0.5, y: 0.15 } },
        { start: { x: 0.5, y: 0.15 }, end: { x: 0.7, y: 0.25 } },
      ]
    }
  ];

  const animate = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animate dynamic gradient background
    gradientOffset.current += 0.0008;
    const gradient = ctx.createLinearGradient(
      Math.sin(gradientOffset.current) * canvas.width * 0.3,
      Math.cos(gradientOffset.current * 0.7) * canvas.height * 0.3,
      Math.cos(gradientOffset.current) * canvas.width * 0.3 + canvas.width,
      Math.sin(gradientOffset.current * 0.7) * canvas.height * 0.3 + canvas.height
    );
    
    gradient.addColorStop(0, 'rgba(42, 75, 61, 0.4)');
    gradient.addColorStop(0.5, 'rgba(216, 124, 74, 0.3)');
    gradient.addColorStop(1, 'rgba(42, 75, 61, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configure line style
    ctx.strokeStyle = 'rgba(226, 194, 144, 0.5)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const currentBlueprint = blueprints[currentBlueprintIndex.current];
    const currentTime = timestamp;

    if (phaseStartTime.current === 0) {
      phaseStartTime.current = currentTime;
    }

    const elapsed = currentTime - phaseStartTime.current;

    switch (phase.current) {
      case 'drawing':
        // Draw completed lines
        for (let i = 0; i < currentLineIndex.current; i++) {
          const line = currentBlueprint.lines[i];
          ctx.beginPath();
          ctx.moveTo(line.start.x * canvas.width, line.start.y * canvas.height);
          ctx.lineTo(line.end.x * canvas.width, line.end.y * canvas.height);
          ctx.stroke();
        }

        // Draw current line progressively
        if (currentLineIndex.current < currentBlueprint.lines.length) {
          const currentLine = currentBlueprint.lines[currentLineIndex.current];
          const progress = Math.min(lineProgress.current, 1);
          
          const currentX = currentLine.start.x + (currentLine.end.x - currentLine.start.x) * progress;
          const currentY = currentLine.start.y + (currentLine.end.y - currentLine.start.y) * progress;
          
          ctx.beginPath();
          ctx.moveTo(currentLine.start.x * canvas.width, currentLine.start.y * canvas.height);
          ctx.lineTo(currentX * canvas.width, currentY * canvas.height);
          ctx.stroke();

          lineProgress.current += 0.025;

          if (lineProgress.current >= 1) {
            currentLineIndex.current++;
            lineProgress.current = 0;
          }
        }

        // Check if drawing is complete
        if (currentLineIndex.current >= currentBlueprint.lines.length) {
          phase.current = 'displaying';
          phaseStartTime.current = currentTime;
        }
        break;

      case 'displaying':
        // Draw all lines
        currentBlueprint.lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.start.x * canvas.width, line.start.y * canvas.height);
          ctx.lineTo(line.end.x * canvas.width, line.end.y * canvas.height);
          ctx.stroke();
        });

        // Wait 3 seconds before fading
        if (elapsed > 3000) {
          phase.current = 'fading';
          phaseStartTime.current = currentTime;
        }
        break;

      case 'fading':
        // Draw with decreasing opacity
        const fadeOpacity = Math.max(0, 1 - (elapsed / 2000));
        ctx.strokeStyle = `rgba(226, 194, 144, ${fadeOpacity * 0.5})`;
        
        currentBlueprint.lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.start.x * canvas.width, line.start.y * canvas.height);
          ctx.lineTo(line.end.x * canvas.width, line.end.y * canvas.height);
          ctx.stroke();
        });

        if (fadeOpacity <= 0) {
          // Move to next blueprint
          currentBlueprintIndex.current = (currentBlueprintIndex.current + 1) % blueprints.length;
          currentLineIndex.current = 0;
          lineProgress.current = 0;
          phase.current = 'drawing';
          phaseStartTime.current = 0;
        }
        break;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedArchitecturalBackground;
