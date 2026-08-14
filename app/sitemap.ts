import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rumahpusaka.or.id';
  const supabase = await createClient();

  // 1. URL Statis Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/koleksi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/koleksi/keris`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/koleksi/tombak`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/koleksi/pedang`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. URL Dinamis dari Database (Hanya Koleksi Status PUBLISHED)
  const { data: collections } = await supabase
    .from('collections')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null);

  const collectionRoutes: MetadataRoute.Sitemap =
    collections?.map((col) => ({
      url: `${baseUrl}/koleksi/${col.slug}`,
      lastModified: new Date(col.updated_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    })) || [];

  return [...staticRoutes, ...collectionRoutes];
}