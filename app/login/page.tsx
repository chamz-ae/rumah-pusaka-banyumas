'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, Loader2, LogIn, Landmark } from 'lucide-react';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // Cek Role User di Tabel Profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/member/dashboard');
      }
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md bg-[#121212] border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Hiasan Aksen Garis Emas */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="text-center mb-8 space-y-2">
        <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] w-fit mx-auto">
          <Landmark className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#D4AF37]">
          Masuk Akun
        </h1>
        <p className="text-xs text-[#F5F2EB]/60">
          Masuk ke portal Rumah Pusaka Banyumas.
        </p>
      </div>

      {message && (
        <p className="text-emerald-400 text-xs text-center mb-4 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg">
          {message}
        </p>
      )}

      {error && (
        <p className="text-red-400 text-xs text-center mb-4 bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#D4AF37]">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-[#D4AF37]/50" />
            <input
              type="email"
              name="email"
              required
              placeholder="nama@email.com"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#D4AF37]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-[#D4AF37]/50" />
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {loading ? 'Memproses Login...' : 'Masuk Sekarang'}
        </button>
      </form>

      <div className="text-center text-xs text-[#F5F2EB]/50 mt-6 pt-4 border-t border-white/10">
        Belum memiliki akun kolektor?{' '}
        <Link href="/register" className="text-[#D4AF37] font-semibold hover:underline">
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4">
      <Suspense fallback={<div className="text-[#D4AF37] text-xs">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}