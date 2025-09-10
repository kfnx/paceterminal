'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/translation-context';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCalendarLine,
  RiExternalLinkLine,
} from '@remixicon/react';

import { Database } from '@/lib/database.types';
import { Locale } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

type AlphaWithToken = Database['public']['Tables']['alpha']['Row'] & {
  tokens: {
    name: string;
    image: string | null;
    tier: number | null;
  } | null;
};

const formatDate = (dateString: string, locale: Locale) => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getTierColor = (tier: number | null) => {
  switch (tier) {
    case 1:
      return 'bg-yellow-500 text-yellow-950';
    case 2:
      return 'bg-green-500 text-green-950';
    case 3:
      return 'bg-blue-500 text-blue-950';
    case 4:
      return 'bg-text-sub-600 text-text-white-0';
    default:
      return 'bg-text-soft-400 text-text-white-0';
  }
};

const getTierLabel = (tier: number | null) => {
  switch (tier) {
    case 1:
      return 'S';
    case 2:
      return 'A';
    case 3:
      return 'B';
    case 4:
      return 'C';
    default:
      return '?';
  }
};

export default function AlphaPage() {
  const { t, locale } = useTranslation();
  const [alphas, setAlphas] = useState<AlphaWithToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpanded = (alphaId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(alphaId)) {
      newExpanded.delete(alphaId);
    } else {
      newExpanded.add(alphaId);
    }
    setExpandedArticles(newExpanded);
  };

  useEffect(() => {
    const fetchAlphas = async () => {
      try {
        const { data, error } = await supabase
          .from('alpha')
          .select(
            `
            *,
            tokens (
              name,
              image,
              tier
            )
          `,
          )
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setAlphas(data || []);
        }
      } catch (err) {
        setError('Failed to fetch alpha data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlphas();
  }, []);

  if (loading) {
    return (
      <div className='flex-1 px-4 py-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-text-strong-950'>
              {locale === 'id' ? 'Alpha Insights' : 'Alpha Insights'}
            </h1>
            <p className='mt-2 text-text-sub-600'>
              {locale === 'id'
                ? 'Wawasan alpha terbaru dari semua token'
                : 'Latest alpha insights from all tokens'}
            </p>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='animate-pulse rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'
              >
                <div className='mb-4 h-4 w-3/4 rounded bg-bg-weak-50'></div>
                <div className='mb-2 h-3 w-1/2 rounded bg-bg-weak-50'></div>
                <div className='h-3 w-full rounded bg-bg-weak-50'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 px-4 py-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='rounded-lg border border-error-base bg-red-alpha-10 p-6 text-center'>
            <p className='text-error-base'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 p-4'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-strong-950'>
            {locale === 'id' ? 'Alpha Insights' : 'Alpha Insights'}
          </h1>
          <p className='mt-2 text-text-sub-600'>
            {locale === 'id'
              ? 'Wawasan alpha terbaru dari semua token'
              : 'Latest alpha insights from all tokens'}
          </p>
        </div>

        {alphas.length === 0 ? (
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-8 text-center'>
            <p className='text-text-sub-600'>
              {locale === 'id'
                ? 'Belum ada alpha insights'
                : 'No alpha insights available'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start'>
            {alphas.map((alpha) => {
              const isExpanded = expandedArticles.has(alpha.id.toString());
              const text =
                locale === 'id'
                  ? alpha.text || ''
                  : alpha.text_en || alpha.text || '';

              // Determine if content should be expandable based on text length
              const shouldShowExpand = text.length > 300;

              return (
                <article
                  key={alpha.id}
                  className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'
                >
                  <div className='flex items-start gap-4'>
                    {alpha.tokens?.image && (
                      <div className='relative h-12 w-12 flex-shrink-0'>
                        <img
                          src={alpha.tokens.image}
                          alt={alpha.tokens.name}
                          className='h-12 w-12 rounded-lg object-cover'
                        />
                        {/* {alpha.tokens.tier && (
                          <div
                            className={`text-xs absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-bg-white-0 font-bold shadow-regular-xs ${getTierColor(alpha.tokens.tier)}`}
                          >
                            {getTierLabel(alpha.tokens.tier)}
                          </div>
                        )} */}
                      </div>
                    )}

                    <div className='min-w-0 flex-1'>
                      <div className='mb-3'>
                        <h3 className='text-lg font-semibold text-text-strong-950'>
                          {locale === 'id'
                            ? alpha.title || 'Alpha Insight'
                            : alpha.title_en || alpha.title || 'Alpha Insight'}
                        </h3>
                        <p className='text-sm mt-1 text-text-sub-600'>
                          {alpha.tokens?.name}
                        </p>
                      </div>

                      <div
                        className={`relative ${!isExpanded && shouldShowExpand ? 'max-h-32 overflow-hidden' : ''}`}
                      >
                        <p className='mb-4 leading-relaxed text-text-sub-600'>
                          {text}
                        </p>

                        {!isExpanded && shouldShowExpand && (
                          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-white-0 to-transparent'></div>
                        )}
                      </div>

                      {shouldShowExpand && (
                        <button
                          onClick={() => toggleExpanded(alpha.id.toString())}
                          className='text-sm mb-4 flex items-center gap-1 text-primary-base transition-colors hover:text-primary-darker'
                        >
                          {isExpanded ? (
                            <>
                              <RiArrowUpSLine className='h-4 w-4' />
                              {locale === 'id' ? 'Tutup' : 'Show less'}
                            </>
                          ) : (
                            <>
                              <RiArrowDownSLine className='h-4 w-4' />
                              {locale === 'id' ? 'Selengkapnya' : 'Read more'}
                            </>
                          )}
                        </button>
                      )}

                      <div className='text-sm flex items-center gap-2 text-text-soft-400'>
                        <RiCalendarLine className='h-4 w-4' />
                        <time dateTime={alpha.created_at}>
                          {formatDate(alpha.created_at, locale)}
                        </time>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
