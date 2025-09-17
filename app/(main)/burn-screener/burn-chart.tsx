'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface BurnChartProps {
  data: Array<{
    name: string;
    percentage: number | null;
  }>;
}

export default function BurnChart({ data }: BurnChartProps) {
  return (
    <div className='shadow-sm relative h-96 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='name'
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor='end'
            height={60}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: 'Percentage (%)',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Percentage']}
            labelStyle={{ color: '#000' }}
            contentStyle={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Bar
            dataKey='percentage'
            fill='#3b82f6'
            radius={[2, 2, 0, 0]}
            name='Burned Percentage'
          />
        </BarChart>
      </ResponsiveContainer>
      <img
        src='/images/semar.png'
        alt='Semar'
        className='absolute bottom-1/2 right-1/2 h-48 w-48 translate-x-1/2 translate-y-1/2 opacity-25'
      />
    </div>
  );
}
