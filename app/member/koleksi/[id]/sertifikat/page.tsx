import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CertificateView from '@/components/public/CertificateView';
import { ArrowLeft } from 'lucide-react';

export default async function MemberCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: collection } = await supabase
    .from('collections')
    .select(`
      *,
      category:categories(name),
      dhapur:dhapurs(name),
      images:collection_images(image_url, is_primary),
      collector:profiles(full_name, username, is_verified)
    `)
    .eq('id', id)
    .eq('created_by', user.id)
    .maybeSingle();

  if (!collection) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-white/10 pb-4 flex items-center justify-between print:hidden">
        <div>
          <Link
            href="/member/koleksi"
            className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Koleksi Saya</span>
          </Link>
          <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
            Sertifikat Keaslian Digital
          </h1>
        </div>
      </div>

      <CertificateView collection={collection} />
    </div>
  );
}