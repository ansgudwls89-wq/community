import { supabase } from '@/utils/supabase';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nol2.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: spaces }, { data: posts }] = await Promise.all([
    supabase.from('spaces').select('slug'),
    supabase.from('posts').select('idx, category, created_at').order('created_at', { ascending: false }).limit(1000),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE_URL}/s/best`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/s/popular`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const spaceRoutes: MetadataRoute.Sitemap = (spaces || []).map(s => ({
    url: `${BASE_URL}/s/${encodeURIComponent(s.slug)}`,
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = (posts || []).map(p => ({
    url: `${BASE_URL}/s/${encodeURIComponent(p.category)}/${p.idx}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...spaceRoutes, ...postRoutes];
}
