import p5 from "p5";
import type { JsTurtleCommand } from "../types/data";

// Exported helper functions for testing

/**
 * Normalizes an angle to the -180 to 180 degree range.
 * @param angle - The angle in degrees to normalize
 * @returns The normalized angle
 */
export const normalizeAngle = (angle: number): number => {
  while (angle > 180) angle -= 360;
  while (angle < -180) angle += 360;
  return angle;
};

/**
 * Calculates move and turn speeds from a turtle speed setting (0-10).
 * Speed 0 means instant (Infinity), speeds 1-10 are mapped to actual values.
 * @param turtleSpeed - Speed value from 0 to 10
 * @returns Object containing moveSpeed and turnSpeed
 */
export const calculateSpeedsFromTurtleSpeed = (
  turtleSpeed: number
): { moveSpeed: number; turnSpeed: number } => {
  if (turtleSpeed === 0) {
    // Speed 0 means instant (no animation)
    return { moveSpeed: Infinity, turnSpeed: Infinity };
  }
  // Map speed 1-10 to actual movement speeds
  const speedMap = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const clampedSpeed = Math.max(1, Math.min(10, turtleSpeed));
  const moveSpeed = speedMap[clampedSpeed];
  const turnSpeed = moveSpeed * 2; // Rotation is proportionally faster
  return { moveSpeed, turnSpeed };
};

// The public interface for our turtle renderer instance
export interface RealTurtleInstance {
  execute: (commands: JsTurtleCommand[]) => Promise<void>;
  stop: () => void;
  reset: () => void;
  clear: () => void;
  destroy: () => void;
  getCanvasDataURL: () => string | null;
}

// This function sets up p5.js and defines how to draw the turtle commands.
export const setupJsTurtle = (container: HTMLElement): RealTurtleInstance => {
  // Clean up any existing p5 canvases in this container
  const existingCanvases = container.querySelectorAll("canvas");
  existingCanvases.forEach((canvas) => canvas.remove());

  let sketch: p5 | null = null;
  let isDestroyed = false;

  // Turtle state
  let x = 200; // Will be set to center in setup
  let y = 150; // Will be set to center in setup
  let heading = -90; // Start facing up (p5.js uses different angle system)
  let penDown = true;
  let penColor = "#000000";
  let fillColor = "#000000";
  let penSize = 2;
  let turtleVisible = true;

  // Animation state for smooth movement
  let targetX = 200;
  let targetY = 150;
  let targetHeading = -90;
  let turtleSpeed = 6; // 0-10 scale (0 = instant, 1 = slowest, 10 = fastest)
  let moveSpeed = 2; // pixels per frame for movement (calculated from turtleSpeed)
  let turnSpeed = 3; // degrees per frame for rotation (calculated from turtleSpeed)

  // Fill state
  let isRecordingFill = false;
  let fillPath: Array<{ x: number; y: number }> = [];

  // Path history for redrawing
  const pathSegments: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    size: number;
  }> = [];

  // Filled shapes
  const filledShapes: Array<{
    points: Array<{ x: number; y: number }>;
    color: string;
  }> = [];

  // Current line being drawn (for animated drawing)
  let currentLine: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    size: number;
  } | null = null;

  // Animation queue system
  interface AnimationTask {
    type: "move" | "turn" | "instant";
    execute: () => boolean; // Returns true when complete
    init?: () => void; // Optional initialization
  }

  const animationQueue: AnimationTask[] = [];
  let currentTask: AnimationTask | null = null;
  let animationResolve: (() => void) | null = null;

  const resetTurtleState = () => {
    if (sketch) {
      x = sketch.width / 2;
      y = sketch.height / 2;
      targetX = x;
      targetY = y;
    } else {
      x = 200;
      y = 150;
      targetX = 200;
      targetY = 150;
    }
    heading = -90;
    targetHeading = -90;
    penDown = true;
    penColor = "#000000";
    fillColor = "#000000";
    penSize = 2;
    turtleSpeed = 6; // Reset to default speed
    turtleVisible = true;
    pathSegments.length = 0;
    filledShapes.length = 0;
    fillPath = [];
    isRecordingFill = false;
    currentLine = null;
    animationQueue.length = 0;
    currentTask = null;
  };

  // Helper to calculate actual speeds from turtle speed setting
  const calculateSpeeds = () => {
    const speeds = calculateSpeedsFromTurtleSpeed(turtleSpeed);
    moveSpeed = speeds.moveSpeed;
    turnSpeed = speeds.turnSpeed;
  };

  // Create the p5.js sketch
  const createSketch = (p: p5) => {
    p.setup = () => {
      p.pixelDensity(1);
      p.createCanvas(400, 300);
      p.background(255);
      x = p.width / 2;
      y = p.height / 2;
      targetX = x;
      targetY = y;
    };

    p.draw = () => {
      if (isDestroyed) return;
      p.background(255);

      // Draw grid
      p.stroke(240);
      p.strokeWeight(1);
      for (let i = 0; i < p.width; i += 50) p.line(i, 0, i, p.height);
      for (let i = 0; i < p.height; i += 50) p.line(0, i, p.width, i);

      // Draw filled shapes
      for (const shape of filledShapes) {
        p.fill(shape.color);
        p.noStroke();
        p.beginShape();
        for (const point of shape.points) p.vertex(point.x, point.y);
        p.endShape(p.CLOSE);
      }

      // Draw all completed path segments
      p.strokeCap(p.ROUND);
      p.noFill();
      for (const segment of pathSegments) {
        p.stroke(segment.color);
        p.strokeWeight(segment.size);
        p.line(segment.x1, segment.y1, segment.x2, segment.y2);
      }

      // Draw current line being animated
      if (currentLine) {
        p.stroke(currentLine.color);
        p.strokeWeight(currentLine.size);
        p.line(currentLine.startX, currentLine.startY, x, y);
      }

      // Draw the turtle if visible
      if (turtleVisible) {
        p.push();
        p.translate(x, y);
        p.rotate(p.radians(heading));

        // --- NEW TURTLE DRAWING LOGIC ---
        p.strokeWeight(1.5);
        p.stroke(30, 100, 30); // Dark green outline
        p.fill(50, 150, 50); // Lighter green fill

        // Legs (simple ellipses)
        p.ellipse(-8, -10, 8, 6);
        p.ellipse(8, -10, 8, 6);
        p.ellipse(-8, 10, 8, 6);
        p.ellipse(8, 10, 8, 6);

        // Body (a larger ellipse)
        p.ellipse(0, 0, 22, 22);

        // Head (a circle)
        p.ellipse(15, 0, 12, 12);

        p.pop();
      }

      // Process animation queue
      if (!currentTask && animationQueue.length > 0) {
        currentTask = animationQueue.shift()!;
        if (currentTask.init) currentTask.init();
      }

      if (currentTask) {
        const isComplete = currentTask.execute();
        if (isComplete) {
          currentTask = null;
          if (animationQueue.length === 0 && animationResolve) {
            animationResolve();
            animationResolve = null;
          }
        }
      }
    };
  };

  // Create animation tasks from commands
  const createAnimationTask = (
    command: JsTurtleCommand
  ): AnimationTask | null => {
    switch (command.type) {
      case "forward": {
        const distance = command.distance;
        if (turtleSpeed === 0) {
          return {
            type: "instant",
            execute: () => {
              const rad = heading * (Math.PI / 180);
              const endX = x + distance * Math.cos(rad);
              const endY = y + distance * Math.sin(rad);
              if (penDown) {
                pathSegments.push({
                  x1: x,
                  y1: y,
                  x2: endX,
                  y2: endY,
                  color: penColor,
                  size: penSize,
                });
              }
              if (isRecordingFill) fillPath.push({ x: endX, y: endY });
              x = endX;
              y = endY;
              targetX = endX;
              targetY = endY;
              return true;
            },
          };
        } else {
          let endX: number, endY: number;
          return {
            type: "move",
            init: () => {
              const rad = heading * (Math.PI / 180);
              endX = x + distance * Math.cos(rad);
              endY = y + distance * Math.sin(rad);
              targetX = endX;
              targetY = endY;
              if (penDown)
                currentLine = {
                  startX: x,
                  startY: y,
                  endX,
                  endY,
                  color: penColor,
                  size: penSize,
                };
              if (isRecordingFill) fillPath.push({ x: endX, y: endY });
            },
            execute: () => {
              const dx = targetX - x;
              const dy = targetY - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0.1) {
                const moveAmount = Math.min(moveSpeed, dist);
                x += (dx / dist) * moveAmount;
                y += (dy / dist) * moveAmount;
                return false;
              }
              x = targetX;
              y = targetY;
              if (currentLine) {
                // THIS IS THE FIX: Explicitly map the properties
                pathSegments.push({
                  x1: currentLine.startX,
                  y1: currentLine.startY,
                  x2: currentLine.endX,
                  y2: currentLine.endY,
                  color: currentLine.color,
                  size: currentLine.size,
                });
                currentLine = null;
              }
              return true;
            },
          };
        }
      }
      case "goto": {
        const gotoX = command.x + 200;
        const gotoY = 150 - command.y;
        if (turtleSpeed === 0) {
          return {
            type: "instant",
            execute: () => {
              if (penDown) {
                pathSegments.push({
                  x1: x,
                  y1: y,
                  x2: gotoX,
                  y2: gotoY,
                  color: penColor,
                  size: penSize,
                });
              }
              if (isRecordingFill) fillPath.push({ x: gotoX, y: gotoY });
              x = gotoX;
              y = gotoY;
              targetX = gotoX;
              targetY = gotoY;
              return true;
            },
          };
        } else {
          return {
            type: "move",
            init: () => {
              targetX = gotoX;
              targetY = gotoY;
              if (penDown)
                currentLine = {
                  startX: x,
                  startY: y,
                  endX: gotoX,
                  endY: gotoY,
                  color: penColor,
                  size: penSize,
                };
              if (isRecordingFill) fillPath.push({ x: gotoX, y: gotoY });
            },
            execute: () => {
              const dx = targetX - x;
              const dy = targetY - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0.1) {
                const moveAmount = Math.min(moveSpeed, dist);
                x += (dx / dist) * moveAmount;
                y += (dy / dist) * moveAmount;
                return false;
              }
              x = targetX;
              y = targetY;
              if (currentLine) {
                // ALSO APPLY THE FIX HERE
                pathSegments.push({
                  x1: currentLine.startX,
                  y1: currentLine.startY,
                  x2: currentLine.endX,
                  y2: currentLine.endY,
                  color: currentLine.color,
                  size: currentLine.size,
                });
                currentLine = null;
              }
              return true;
            },
          };
        }
      }
      // (The rest of the switch statement remains the same)
      case "right":
      case "left": {
        const angle = command.type === "right" ? command.angle : -command.angle;
        if (turtleSpeed === 0) {
          return {
            type: "instant",
            execute: () => {
              heading = normalizeAngle(heading + angle);
              targetHeading = heading;
              return true;
            },
          };
        } else {
          return {
            type: "turn",
            init: () => {
              targetHeading = normalizeAngle(targetHeading + angle);
            },
            execute: () => {
              const angleDiff = normalizeAngle(targetHeading - heading);
              if (Math.abs(angleDiff) > 0.1) {
                const turnAmount = Math.min(turnSpeed, Math.abs(angleDiff));
                heading += Math.sign(angleDiff) * turnAmount;
                return false;
              }
              heading = targetHeading;
              return true;
            },
          };
        }
      }
      case "penup":
        return {
          type: "instant",
          execute: () => {
            penDown = false;
            return true;
          },
        };
      case "pendown":
        return {
          type: "instant",
          execute: () => {
            penDown = true;
            if (isRecordingFill) fillPath.push({ x, y });
            return true;
          },
        };
      case "setPenColor":
        return {
          type: "instant",
          execute: () => {
            penColor = command.color;
            return true;
          },
        };
      case "setFillColor":
        return {
          type: "instant",
          execute: () => {
            fillColor = command.color;
            return true;
          },
        };
      case "setPenSize":
        return {
          type: "instant",
          execute: () => {
            penSize = command.size;
            return true;
          },
        };
      case "setSpeed":
        return {
          type: "instant",
          execute: () => {
            turtleSpeed = Math.max(0, Math.min(10, command.speed));
            calculateSpeeds();
            return true;
          },
        };
      case "beginFill":
        return {
          type: "instant",
          execute: () => {
            isRecordingFill = true;
            fillPath = [{ x, y }];
            return true;
          },
        };
      case "endFill":
        return {
          type: "instant",
          execute: () => {
            if (isRecordingFill && fillPath.length > 2)
              filledShapes.push({ points: [...fillPath], color: fillColor });
            isRecordingFill = false;
            fillPath = [];
            return true;
          },
        };
      case "clear":
        return {
          type: "instant",
          execute: () => {
            pathSegments.length = 0;
            filledShapes.length = 0;
            currentLine = null;
            fillPath = [];
            return true;
          },
        };
      default:
        return null;
    }
  };

  const executeAllCommands = async (
    commands: JsTurtleCommand[]
  ): Promise<void> => {
    return new Promise((resolve) => {
      resetTurtleState();
      calculateSpeeds();
      animationQueue.length = 0;
      currentTask = null;

      for (const command of commands) {
        // Note: I've corrected a small bug here. Your original code passed extra
        // arguments to createAnimationTask which were not in its definition.
        const task = createAnimationTask(command);
        if (task) animationQueue.push(task);
      }

      animationResolve = resolve;
      if (animationQueue.length === 0) {
        resolve();
        animationResolve = null;
      }
    });
  };

  const stopAnimation = () => {
    animationQueue.length = 0; // Clear all upcoming tasks
    currentTask = null; // Stop the current task
    if (animationResolve) {
      animationResolve(); // Resolve the promise to unblock the hook
      animationResolve = null;
    }
    // Note: We leave the drawing as-is, showing the stopped state.
  };

  const clearCanvas = () => {
    resetTurtleState();
    if (sketch) sketch.background(255);
  };

  const destroy = () => {
    isDestroyed = true;
    if (sketch) {
      sketch.remove();
      sketch = null;
    }
  };

  sketch = new p5(createSketch, container);

  const getCanvasDataURL = (): string | null => {
    if (!sketch || !sketch.canvas) {
      return null;
    }

    // On high DPI displays (Retina), p5.js may ignore pixelDensity(1) and create
    // a canvas buffer that's 2x the requested size (800x600 instead of 400x300).
    // To ensure consistent dimensions across all displays, we manually scale down
    // the captured image to exactly 400x300.

    const targetWidth = 400;
    const targetHeight = 300;
    const actualWidth = sketch.canvas.width;
    const actualHeight = sketch.canvas.height;

    // If canvas is already the target size, return directly
    if (actualWidth === targetWidth && actualHeight === targetHeight) {
      return sketch.canvas.toDataURL("image/png");
    }

    // Otherwise, scale down to target size using a temporary canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      console.error("Failed to get 2d context for scaling");
      return sketch.canvas.toDataURL("image/png");
    }

    // Draw the p5 canvas onto the temp canvas, scaling it down
    tempCtx.drawImage(sketch.canvas, 0, 0, targetWidth, targetHeight);

    return tempCanvas.toDataURL("image/png");
  };

  return {
    execute: executeAllCommands,
    stop: stopAnimation,
    reset: clearCanvas,
    clear: clearCanvas,
    destroy,
    getCanvasDataURL,
  };
};
