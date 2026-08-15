'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, MapPin, Phone, Globe, AtSign, Loader2, Save, Upload } from 'lucide-react';

export default function MemberProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    phone_number: '',
    instagram_handle: '',
    avatar_url: '',
  });

  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile(data);
        } else {
          // Default fallback jika data profil baru dibuat
          setProfile((prev: any) => ({
            ...prev,
            full_name: user.email?.split('@')[0] || '',
            username: `kolektor_${user.id.slice(0, 5)}`,
          }));
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, [supabase]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadErr) {
      alert(`Gagal mengunggah foto: ${uploadErr.message}`);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName);

    setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Sesi Anda berakhir, silakan login kembali.');
      setSaving(false);
      return;
    }

    const cleanUsername = profile.username
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    // Menggunakan UPSERT agar jika profil belum ada, otomatis DIBUAT
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: profile.full_name,
        username: cleanUsername,
        bio: profile.bio,
        location: profile.location,
        phone_number: profile.phone_number,
        instagram_handle: profile.instagram_handle,
        avatar_url: profile.avatar_url,
        role: 'collector',
        updated_at: new Date().toISOString(),
      });

    if (error) {
      alert(`Gagal memperbarui profil: ${error.message}`);
    } else {
      alert('Profil berhasil disimpan!');
      window.location.reload(); // Refresh halaman agar data terbaru langsung dimuat di header/dashboard
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#D4AF37]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-serif text-[#D4AF37] font-bold">
          Sunting Profil Kolektor
        </h1>
        <p className="text-xs text-[#F5F2EB]/60 mt-1">
          Informasi ini akan tampil pada halaman galeri publik Anda.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-2xl border border-white/10 bg-[#121212] space-y-6">
        {/* Foto Avatar */}
        <div className="flex items-center gap-6 pb-6 border-b border-white/10">
          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shrink-0 relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-[#D4AF37]" />
            )}
          </div>
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-[#D4AF37] text-xs font-semibold text-[#D4AF37] rounded-lg cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Profil</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
            <p className="text-[10px] text-[#F5F2EB]/40">Format PNG/JPG max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Nama Lengkap</label>
            <input
              type="text"
              required
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Username Publik (@)</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 w-4 h-4 text-[#F5F2EB]/40" />
              <input
                type="text"
                required
                value={profile.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#D4AF37]">Bio / Deskripsi Kolektor</label>
          <textarea
            rows={3}
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Contoh: Pencinta dan pelestari tosan aji spesialisasi keris tangguh Mataram..."
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Lokasi / Kota</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#F5F2EB]/40" />
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Banyumas, Jawa Tengah"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">WhatsApp (Opsional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-[#F5F2EB]/40" />
              <input
                type="text"
                value={profile.phone_number || ''}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                placeholder="08123456789"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4AF37]">Instagram Handle</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-4 h-4 text-[#F5F2EB]/40" />
              <input
                type="text"
                value={profile.instagram_handle || ''}
                onChange={(e) => setProfile({ ...profile, instagram_handle: e.target.value })}
                placeholder="kolektor_pusaka"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}