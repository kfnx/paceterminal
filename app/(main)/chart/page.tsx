'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCalendarLine,
  RiExternalLinkLine,
} from '@remixicon/react';
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

import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

const data = [
  { name: 'TCM', percentage: 3.45 },
  { name: 'BUIDL', percentage: 5.12 },
  { name: 'GLMPS', percentage: 2.89 },
  { name: 'WOM', percentage: 7.62 },
  { name: 'PRGN', percentage: 4.75 },
  { name: 'BUDDY', percentage: 6.01 },
  { name: 'PACE', percentage: 1.92 },
  { name: 'STARTUP', percentage: 8.44 },
  { name: 'PNP', percentage: 3.07 },
  { name: 'CLUB', percentage: 4.56 },
  { name: 'asdfg', percentage: 2.15 },
  { name: 'LIGHT', percentage: 5.98 },
  { name: 'FITCOIN', percentage: 9.21 },
  { name: 'GRAND', percentage: 6.33 },
];

export default function ChartPage() {
  const { t, locale } = useTranslation();

  return (
    <div className='flex-1 p-4'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-strong-950'>
            {locale === 'id' ? 'Chart' : 'Chart'}
          </h1>
          <p className='mt-2 text-text-sub-600'>
            {locale === 'id'
              ? 'Chart terbaru dari semua token'
              : 'Latest chart from all tokens'}
          </p>
        </div>

        <div className='shadow-sm h-96 w-full rounded-lg border bg-white p-4'>
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
                name='Token Percentage'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='shadow-sm rounded-lg border bg-white p-4'>
            <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
              {locale === 'id' ? 'Top Performers' : 'Top Performers'}
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={data.filter((item) => item.percentage > 6)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Bar
                    dataKey='percentage'
                    fill='#10b981'
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='shadow-sm rounded-lg border bg-white p-4'>
            <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
              {locale === 'id' ? 'Under Performers' : 'Under Performers'}
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={data.filter((item) => item.percentage <= 4)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Bar
                    dataKey='percentage'
                    fill='#ef4444'
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
