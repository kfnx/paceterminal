'use client';

import { useTranslation } from '@/contexts/translation-context';
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

const data = [
  { name: 'DUPE', percentage: 21.32 },
  { name: 'FITCOIN', percentage: 7.62 },
  { name: 'CLUB', percentage: 6.01 },
  { name: 'PUMP', percentage: 5.76 },
  { name: 'VIVA', percentage: 5.0 },
  { name: 'LIGHT', percentage: 4.79 },
  { name: 'PM', percentage: 4.06 },
  { name: 'WMDR', percentage: 2.58 },
  { name: 'PRGN', percentage: 2.25 },
  { name: 'AIXBC', percentage: 1.87 },
  { name: 'POGGER', percentage: 1.53 },
  { name: 'PACE', percentage: 1.45 },
  { name: 'WOM', percentage: 1.0 },
  { name: 'ORGO', percentage: 0.9 },
  { name: 'YAPPER', percentage: 0.8 },
  { name: 'MOBY', percentage: 0.7 },
  { name: 'BELIEVEGPT', percentage: 0.61 },
  { name: 'LAUNCHCOIN', percentage: 0.43 },
  { name: 'PCULE', percentage: 0.32 },
  { name: 'BUDDY', percentage: 0.08 },
];

export default function ChartPage() {
  const { t, locale } = useTranslation();

  return (
    <div className='flex-1 p-4'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-strong-950'>
            Burn Screener
          </h1>
          <p>Token burn percentage for each tokens</p>
        </div>

        {/* <ChartStepLine data={data} index='percentage' categories={['name']} /> */}
        <div className='shadow-sm h-96 w-full'>
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
        </div>
      </div>
    </div>
  );
}
