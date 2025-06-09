
import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
}

interface Drawing {
  name: string;
  lines: Line[];
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const currentDrawingIndex = useRef(0);
  const currentLineIndex = useRef(0);
  const lineProgress = useRef(0);
  const fadeProgress = useRef(0);
  const phase = useRef<'drawing' | 'displaying' | 'fading'>('drawing');
  const phaseStartTime = useRef(0);
  const gradientOffset = useRef(0);

  // Definir desenhos arquitetônicos
  const drawings: Drawing[] = [
    {
      name: 'Casa Moderna',
      lines: [
        // Base da casa
        { start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
        { start: { x: 0.2, y: 0.7 }, end: { x: 0.2, y: 0.4 } },
        { start: { x: 0.8, y: 0.7 }, end: { x: 0.8, y: 0.4 } },
        // Telhado
        { start: { x: 0.2, y: 0.4 }, end: { x: 0.5, y: 0.2 } },
        { start: { x: 0.5, y: 0.2 }, end: { x: 0.8, y: 0.4 } },
        // Porta
        { start: { x: 0.45, y: 0.7 }, end: { x: 0.45, y: 0.55 } },
        { start: { x: 0.45, y: 0.55 }, end: { x: 0.55, y: 0.55 } },
        { start: { x: 0.55, y: 0.55 }, end: { x: 0.55, y: 0.7 } },
        // Janela
        { start: { x: 0.25, y: 0.5 }, end: { x: 0.35, y: 0.5 } },
        { start: { x: 0.25, y: 0.5 }, end: { x: 0.25, y: 0.6 } },
        { start: { x: 0.35, y: 0.5 }, end: { x: 0.35, y: 0.6 } },
        { start: { x: 0.25, y: 0.6 }, end: { x: 0.35, y: 0.6 } },
      ]
    },
    {
      name: 'Prédio',
      lines: [
        // Estrutura principal
        { start: { x: 0.3, y: 0.8 }, end: { x: 0.3, y: 0.2 } },
        { start: { x: 0.7, y: 0.8 }, end: { x: 0.7, y: 0.2 } },
        { start: { x: 0.3, y: 0.2 }, end: { x: 0.7, y: 0.2 } },
        { start: { x: 0.3, y: 0.8 }, end: { x: 0.7, y: 0.8 } },
        // Janelas - andar 1
        { start: { x: 0.35, y: 0.3 }, end: { x: 0.45, y: 0.3 } },
        { start: { x: 0.35, y: 0.3 }, end: { x: 0.35, y: 0.4 } },
        { start: { x: 0.45, y: 0.3 }, end: { x: 0.45, y: 0.4 } },
        { start: { x: 0.35, y: 0.4 }, end: { x: 0.45, y: 0.4 } },
        { start: { x: 0.55, y: 0.3 }, end: { x: 0.65, y: 0.3 } },
        { start: { x: 0.55, y: 0.3 }, end: { x: 0.55, y: 0.4 } },
        { start: { x: 0.65, y: 0.3 }, end: { x: 0.65, y: 0.4 } },
        { start: { x: 0.55, y: 0.4 }, end: { x: 0.65, y: 0.4 } },
        // Janelas - andar 2
        { start: { x: 0.35, y: 0.5 }, end: { x: 0.45, y: 0.5 } },
        { start: { x: 0.35, y: 0.5 }, end: { x: 0.35, y: 0.6 } },
        { start: { x: 0.45, y: 0.5 }, end: { x: 0.45, y: 0.6 } },
        { start: { x: 0.35, y: 0.6 }, end: { x: 0.45, y: 0.6 } },
        { start: { x: 0.55, y: 0.5 }, end: { x: 0.65, y: 0.5 } },
        { start: { x: 0.55, y: 0.5 }, end: { x: 0.55, y: 0.6 } },
        { start: { x: 0.65, y: 0.5 }, end: { x: 0.65, y: 0.6 } },
        { start: { x: 0.55, y: 0.6 }, end: { x: 0.65, y: 0.6 } },
      ]
    },
    {
      name: 'Monumento',
      lines: [
        // Base
        { start: { x: 0.25, y: 0.8 }, end: { x: 0.75, y: 0.8 } },
        { start: { x: 0.25, y: 0.8 }, end: { x: 0.25, y: 0.75 } },
        { start: { x: 0.75, y: 0.8 }, end: { x: 0.75, y: 0.75 } },
        { start: { x: 0.25, y: 0.75 }, end: { x: 0.75, y: 0.75 } },
        // Colunas
        { start: { x: 0.35, y: 0.75 }, end: { x: 0.35, y: 0.3 } },
        { start: { x: 0.45, y: 0.75 }, end: { x: 0.45, y: 0.3 } },
        { start: { x: 0.55, y: 0.75 }, end: { x: 0.55, y: 0.3 } },
        { start: { x: 0.65, y: 0.75 }, end: { x: 0.65, y: 0.3 } },
        // Topo
        { start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
        { start: { x: 0.3, y: 0.3 }, end: { x: 0.3, y: 0.25 } },
        { start: { x: 0.7, y: 0.3 }, end: { x: 0.7, y: 0.25 } },
        { start: { x: 0.3, y: 0.25 }, end: { x: 0.7, y: 0.25 } },
        // Frontão triangular
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

    // Atualizar tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Animar degradê de fundo
    gradientOffset.current += 0.0005;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const offset = Math.sin(gradientOffset.current) * 0.2 + 0.5;
    gradient.addColorStop(0, `rgba(26, 26, 26, 1)`);
    gradient.addColorStop(offset, `rgba(74, 108, 88, 0.3)`);
    gradient.addColorStop(1, `rgba(232, 168, 124, 0.2)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configurar estilo das linhas
    ctx.strokeStyle = 'rgba(212, 178, 129, 0.6)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const currentDrawing = drawings[currentDrawingIndex.current];
    const currentTime = timestamp;

    if (phaseStartTime.current === 0) {
      phaseStartTime.current = currentTime;
    }

    const elapsed = currentTime - phaseStartTime.current;

    switch (phase.current) {
      case 'drawing':
        // Desenhar linhas já completas
        for (let i = 0; i < currentLineIndex.current; i++) {
          const line = currentDrawing.lines[i];
          ctx.beginPath();
          ctx.moveTo(line.start.x * canvas.width, line.start.y * canvas.height);
          ctx.lineTo(line.end.x * canvas.width, line.end.y * canvas.height);
          ctx.stroke();
        }

        // Desenhar linha atual progressivamente
        if (currentLineIndex.current < currentDrawing.lines.length) {
          const currentLine = currentDrawing.lines[currentLineIndex.current];
          const progress = Math.min(lineProgress.current, 1);
          
          const currentX = currentLine.start.x + (currentLine.end.x - currentLine.start.x) * progress;
          const currentY = currentLine.start.y + (currentLine.end.y - currentLine.start.y) * progress;
          
          ctx.beginPath();
          ctx.moveTo(currentLine.start.x * canvas.width, currentLine.start.y * canvas.height);
          ctx.lineTo(currentX * canvas.width, currentY * canvas.height);
          ctx.stroke();

          lineProgress.current += 0.02;

          if (lineProgress.current >= 1) {
            currentLineIndex.current++;
            lineProgress.current = 0;
          }
        }

        // Verificar se o desenho está completo
        if (currentLineIndex.current >= currentDrawing.lines.length) {
          phase.current = 'displaying';
          phaseStartTime.current = currentTime;
        }
        break;

      case 'displaying':
        // Desenhar todas as linhas
        currentDrawing.lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.start.x * canvas.width, line.start.y * canvas.height);
          ctx.lineTo(line.end.x * canvas.width, line.end.y * canvas.height);
          ctx.stroke();
        });

        // Aguardar 3 segundos antes de desvanecer
        if (elapsed > 3000) {
          phase.current = 'fading';
          phaseStartTime.current = currentTime;
        }
        break;

      case 'fading':
        // Desenhar com opacidade decrescente
        const fadeOpacity = Math.max(0, 1 - (elapsed / 2000));
        ctx.strokeStyle = `rgba(212, 178, 129, ${fadeOpacity * 0.6})`;
        
        currentDrawing.lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.start.x * canvas.width, line.start.y * canvas.height);
          ctx.lineTo(line.end.x * canvas.width, line.end.y * canvas.height);
          ctx.stroke();
        });

        if (fadeOpacity <= 0) {
          // Passar para o próximo desenho
          currentDrawingIndex.current = (currentDrawingIndex.current + 1) % drawings.length;
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

export default AnimatedBackground;
