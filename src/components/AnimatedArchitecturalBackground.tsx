
import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Blueprint {
  lines: Point[][];
  currentLine: number;
  currentPoint: number;
  completed: boolean;
  fadeOut: number;
}

const AnimatedArchitecturalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const blueprintsRef = useRef<Blueprint[]>([]);
  const currentBlueprintRef = useRef(0);
  const timeRef = useRef(0);

  // Definir blueprints de construções
  const createBlueprints = (width: number, height: number): Blueprint[] => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 800;

    return [
      // Casa simples
      {
        lines: [
          // Base da casa
          [
            { x: centerX - 100 * scale, y: centerY + 50 * scale },
            { x: centerX + 100 * scale, y: centerY + 50 * scale },
            { x: centerX + 100 * scale, y: centerY - 30 * scale },
            { x: centerX - 100 * scale, y: centerY - 30 * scale },
            { x: centerX - 100 * scale, y: centerY + 50 * scale }
          ],
          // Telhado
          [
            { x: centerX - 100 * scale, y: centerY - 30 * scale },
            { x: centerX, y: centerY - 80 * scale },
            { x: centerX + 100 * scale, y: centerY - 30 * scale }
          ],
          // Porta
          [
            { x: centerX - 20 * scale, y: centerY + 50 * scale },
            { x: centerX - 20 * scale, y: centerY + 10 * scale },
            { x: centerX + 20 * scale, y: centerY + 10 * scale },
            { x: centerX + 20 * scale, y: centerY + 50 * scale }
          ],
          // Janela esquerda
          [
            { x: centerX - 70 * scale, y: centerY - 5 * scale },
            { x: centerX - 70 * scale, y: centerY - 20 * scale },
            { x: centerX - 50 * scale, y: centerY - 20 * scale },
            { x: centerX - 50 * scale, y: centerY - 5 * scale },
            { x: centerX - 70 * scale, y: centerY - 5 * scale }
          ],
          // Janela direita
          [
            { x: centerX + 50 * scale, y: centerY - 5 * scale },
            { x: centerX + 50 * scale, y: centerY - 20 * scale },
            { x: centerX + 70 * scale, y: centerY - 20 * scale },
            { x: centerX + 70 * scale, y: centerY - 5 * scale },
            { x: centerX + 50 * scale, y: centerY - 5 * scale }
          ]
        ],
        currentLine: 0,
        currentPoint: 0,
        completed: false,
        fadeOut: 1
      },
      // Prédio moderno
      {
        lines: [
          // Base do prédio
          [
            { x: centerX - 80 * scale, y: centerY + 60 * scale },
            { x: centerX + 80 * scale, y: centerY + 60 * scale },
            { x: centerX + 80 * scale, y: centerY - 100 * scale },
            { x: centerX - 80 * scale, y: centerY - 100 * scale },
            { x: centerX - 80 * scale, y: centerY + 60 * scale }
          ],
          // Janelas andar 1
          [
            { x: centerX - 60 * scale, y: centerY + 40 * scale },
            { x: centerX - 60 * scale, y: centerY + 20 * scale },
            { x: centerX - 30 * scale, y: centerY + 20 * scale },
            { x: centerX - 30 * scale, y: centerY + 40 * scale }
          ],
          [
            { x: centerX + 30 * scale, y: centerY + 40 * scale },
            { x: centerX + 30 * scale, y: centerY + 20 * scale },
            { x: centerX + 60 * scale, y: centerY + 20 * scale },
            { x: centerX + 60 * scale, y: centerY + 40 * scale }
          ],
          // Janelas andar 2
          [
            { x: centerX - 60 * scale, y: centerY + 10 * scale },
            { x: centerX - 60 * scale, y: centerY - 10 * scale },
            { x: centerX - 30 * scale, y: centerY - 10 * scale },
            { x: centerX - 30 * scale, y: centerY + 10 * scale }
          ],
          [
            { x: centerX + 30 * scale, y: centerY + 10 * scale },
            { x: centerX + 30 * scale, y: centerY - 10 * scale },
            { x: centerX + 60 * scale, y: centerY - 10 * scale },
            { x: centerX + 60 * scale, y: centerY + 10 * scale }
          ],
          // Janelas andar 3
          [
            { x: centerX - 60 * scale, y: centerY - 20 * scale },
            { x: centerX - 60 * scale, y: centerY - 40 * scale },
            { x: centerX - 30 * scale, y: centerY - 40 * scale },
            { x: centerX - 30 * scale, y: centerY - 20 * scale }
          ],
          [
            { x: centerX + 30 * scale, y: centerY - 20 * scale },
            { x: centerX + 30 * scale, y: centerY - 40 * scale },
            { x: centerX + 60 * scale, y: centerY - 40 * scale },
            { x: centerX + 60 * scale, y: centerY - 20 * scale }
          ]
        ],
        currentLine: 0,
        currentPoint: 0,
        completed: false,
        fadeOut: 1
      },
      // Monumento/Torre
      {
        lines: [
          // Base da torre
          [
            { x: centerX - 40 * scale, y: centerY + 70 * scale },
            { x: centerX + 40 * scale, y: centerY + 70 * scale },
            { x: centerX + 40 * scale, y: centerY - 50 * scale },
            { x: centerX - 40 * scale, y: centerY - 50 * scale },
            { x: centerX - 40 * scale, y: centerY + 70 * scale }
          ],
          // Topo da torre
          [
            { x: centerX - 40 * scale, y: centerY - 50 * scale },
            { x: centerX - 20 * scale, y: centerY - 90 * scale },
            { x: centerX + 20 * scale, y: centerY - 90 * scale },
            { x: centerX + 40 * scale, y: centerY - 50 * scale }
          ],
          // Pináculo
          [
            { x: centerX - 20 * scale, y: centerY - 90 * scale },
            { x: centerX, y: centerY - 120 * scale },
            { x: centerX + 20 * scale, y: centerY - 90 * scale }
          ],
          // Detalhes da base
          [
            { x: centerX - 30 * scale, y: centerY + 50 * scale },
            { x: centerX + 30 * scale, y: centerY + 50 * scale }
          ],
          [
            { x: centerX - 30 * scale, y: centerY + 20 * scale },
            { x: centerX + 30 * scale, y: centerY + 20 * scale }
          ],
          [
            { x: centerX - 30 * scale, y: centerY - 10 * scale },
            { x: centerX + 30 * scale, y: centerY - 10 * scale }
          ]
        ],
        currentLine: 0,
        currentPoint: 0,
        completed: false,
        fadeOut: 1
      }
    ];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      blueprintsRef.current = createBlueprints(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      timeRef.current += 0.01;
      
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhar degradê animado
      const gradient = ctx.createLinearGradient(
        0, 0, 
        canvas.width * (0.5 + 0.3 * Math.sin(timeRef.current * 0.5)), 
        canvas.height * (0.5 + 0.3 * Math.cos(timeRef.current * 0.3))
      );
      
      gradient.addColorStop(0, 'rgba(26, 26, 26, 1)');
      gradient.addColorStop(0.3, 'rgba(42, 75, 61, 0.4)');
      gradient.addColorStop(0.7, 'rgba(216, 124, 74, 0.4)');
      gradient.addColorStop(1, 'rgba(26, 26, 26, 1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar blueprints
      const currentBlueprint = blueprintsRef.current[currentBlueprintRef.current];
      if (currentBlueprint && !currentBlueprint.completed) {
        const currentLine = currentBlueprint.lines[currentBlueprint.currentLine];
        if (currentLine) {
          ctx.strokeStyle = `rgba(226, 194, 144, ${currentBlueprint.fadeOut * 0.8})`;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // Desenhar linhas já completadas
          for (let i = 0; i < currentBlueprint.currentLine; i++) {
            const line = currentBlueprint.lines[i];
            ctx.beginPath();
            ctx.moveTo(line[0].x, line[0].y);
            for (let j = 1; j < line.length; j++) {
              ctx.lineTo(line[j].x, line[j].y);
            }
            ctx.stroke();
          }

          // Desenhar linha atual sendo traçada
          if (currentBlueprint.currentPoint > 0) {
            ctx.beginPath();
            ctx.moveTo(currentLine[0].x, currentLine[0].y);
            for (let i = 1; i <= Math.min(currentBlueprint.currentPoint, currentLine.length - 1); i++) {
              ctx.lineTo(currentLine[i].x, currentLine[i].y);
            }
            ctx.stroke();
          }

          // Avançar na animação
          if (timeRef.current % 0.1 < 0.02) {
            currentBlueprint.currentPoint++;
            if (currentBlueprint.currentPoint >= currentLine.length) {
              currentBlueprint.currentLine++;
              currentBlueprint.currentPoint = 0;
              
              if (currentBlueprint.currentLine >= currentBlueprint.lines.length) {
                currentBlueprint.completed = true;
                setTimeout(() => {
                  const fadeInterval = setInterval(() => {
                    currentBlueprint.fadeOut -= 0.02;
                    if (currentBlueprint.fadeOut <= 0) {
                      clearInterval(fadeInterval);
                      // Resetar para próximo blueprint
                      currentBlueprintRef.current = (currentBlueprintRef.current + 1) % blueprintsRef.current.length;
                      blueprintsRef.current.forEach(bp => {
                        bp.currentLine = 0;
                        bp.currentPoint = 0;
                        bp.completed = false;
                        bp.fadeOut = 1;
                      });
                    }
                  }, 50);
                }, 2000);
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
