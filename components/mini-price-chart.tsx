'use client';

import { useMemo } from 'react';

interface MiniPriceChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function MiniPriceChart({
  data,
  width = 96,
  height = 48,
  color,
}: MiniPriceChartProps) {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return '';

    const validData = data.filter((val) => !isNaN(val) && isFinite(val));
    if (validData.length === 0) return '';

    const minValue = Math.min(...validData);
    const maxValue = Math.max(...validData);
    const range = maxValue - minValue || 1;

    const points = validData.map((value, index) => {
      const x = (index / (validData.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  // Determine color based on trend (first vs last value)
  const trend = useMemo(() => {
    if (!data || data.length < 2) return 'neutral';
    const first = data[0];
    const last = data[data.length - 1];
    return last >= first ? 'up' : 'down';
  }, [data]);

  const strokeColor =
    color ||
    (trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#6b7280');

  if (!pathData) {
    return (
      <svg width={width} height={height} className='opacity-20'>
        <line
          x1='0'
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke='currentColor'
          strokeWidth='1'
          strokeDasharray='2,2'
        />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className='overflow-visible'
    >
      <path
        d={pathData}
        fill='none'
        stroke={strokeColor}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
