import { createClient } from '@/lib/supabase/server';
import { ShieldCheck, UserCheck, Mail, MapPin, Layers } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function AdminCollectorsPage() {
  const supabase = await createClient();

  // Server Action untuk toggle status verifikasi kolektor
  async function toggleVerification(formData: FormData) {
    'use server';
    const collectorId = formData.get('collectorId') as string;
    const currentStatus = formData.get('currentStatus') === 'true';

    const db = await createClient();
    await db
      .from('profiles')
      .update({ is_verified: !currentStatus })
      .eq('id', collectorId);

    revalidatePath('/admin/kolektor');
  }

  // Fetch daftar seluruh profiles dengan role 'collector'
  const { data: collectors } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      username,
      email,
      location,
      phone_number,
      is_verified,
      created_at
    `)
    .eq('role', 'collector')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-[#F5F2EB]">
      {/* Header Halaman */}
      <div className="border-b border-white/10 pb-5">
        <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
          Kurasi Museum
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] font-bold mt-1">
          Manajemen & Verifikasi Kolektor
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Berikan lencana Verified Heritage Badge (🛡️) kepada anggota komunitas kolektor yang terpercaya.
        </p>
      </div>

      {/* Tabel Daftar Kolektor */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#1A1A1A] text-[#D4AF37] uppercase tracking-wider font-mono">
                <th className="p-4">Kolektor</th>
                <th className="p-4">Kontak / Lokasi</th>
                <th className="p-4">Status Kurasi</th>
                <th className="p-4 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {collectors && collectors.length > 0 ? (
                collectors.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-serif font-bold uppercase shrink-0">
                          {item.full_name?.charAt(0) || 'K'}
                        </div>
                        <div>
                          <div className="font-bold text-[#F5F2EB] flex items-center gap-1.5">
                            <span>{item.full_name}</span>
                            {item.is_verified && <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />}
                          </div>
                          <Link
                            href={`/kolektor/${item.username}`}
                            target="_blank"
                            className="font-mono text-[11px] text-[#D4AF37] hover:underline"
                          >
                            @{item.username}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#F5F2EB]/80">
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{item.email}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-[#F5F2EB]/60">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {item.is_verified ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-[10px] uppercase inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Terverifikasi</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#F5F2EB]/40 font-bold text-[10px] uppercase">
                          Belum Verifikasi
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <form action={toggleVerification}>
                        <input type="hidden" name="collectorId" value={item.id} />
                        <input type="hidden" name="currentStatus" value={item.is_verified ? 'true' : 'false'} />
                        <button
                          type="submit"
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 ${
                            item.is_verified
                              ? 'bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-900/60'
                              : 'bg-[#D4AF37] text-black hover:bg-[#C5A059]'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{item.is_verified ? 'Batalkan Badge' : 'Beri Badge 🛡️'}</span>
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-xs text-[#F5F2EB]/40">
                    Belum ada anggota kolektor yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}