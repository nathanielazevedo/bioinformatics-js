import React, { useState, useRef } from 'react';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentValue = value[0] || min;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    onValueChange([Math.max(min, Math.min(max, steppedValue))]);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <div
        ref={sliderRef}
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute h-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 -translate-y-1/2 top-1/2"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
};