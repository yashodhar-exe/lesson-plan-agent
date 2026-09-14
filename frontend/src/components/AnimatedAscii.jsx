import React, { useEffect, useRef } from 'react';

const DENSITY = ' .:+*#%@';

const AnimatedAscii = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // We'll draw text on the canvas for high performance
    const render = () => {
      // Handle resizing
      const parent = canvas.parentElement;
      if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      ctx.fillStyle = '#ffffff'; // Plain white background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#000000'; // Black text
      ctx.font = '10px monospace';
      ctx.textBaseline = 'top';

      const charWidth = 6;
      const charHeight = 10;

      const cols = Math.floor(canvas.width / charWidth);
      const rows = Math.floor(canvas.height / charHeight);

      // Create a fluid animation effect
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Normalize coordinates
          const nx = x / cols;
          const ny = y / rows;

          // Math function to create fluid blobs (decreased multipliers = zoomed in / larger art)
          const val = Math.sin(nx * 5 + time) * Math.cos(ny * 5 + time) +
            Math.sin(nx * 2.5 - time * 0.5) * Math.cos(ny * 7.5 + time * 0.8);

          // Map value from [-2, 2] roughly to [0, 1]
          let normalized = (val + 2) / 4;
          normalized = Math.max(0, Math.min(1, normalized)); // Clamp

          // Add a mask to make it look like a distinct shape in the center
          const dx = nx - 0.5;
          const dy = ny - 0.5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // 1.8 falloff makes the blob larger overall than 2.0
          let densityMod = 1 - (dist * 1.8);
          densityMod = Math.max(0, densityMod);

          const finalVal = normalized * densityMod;

          const charIndex = Math.floor(finalVal * (DENSITY.length - 1));
          const char = DENSITY[charIndex];

          if (char !== ' ') {
            ctx.fillText(char, x * charWidth, y * charHeight);
          }
        }
      }

      time += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full bg-white overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default AnimatedAscii;
