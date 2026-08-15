'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, AtSign, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const username = formData.get('username') as string;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          role: 'collector',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      router.push('/login?message=Registrasi berhasil, silakan cek email Anda untuk verifikasi.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4">
      <div className="w-full max-w-md bg-[#121212] border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-[#D4AF37]">Daftar Akun Kolektor</h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-2">Gabung ke komunitas Rumah Pusaka Banyumas.</p>
        </div>

        {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-[#D4AF37]/50" />
            <input name="fullName" required placeholder="Nama Lengkap" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-[#D4AF37] outline-none" />
          </div>
          
          <div className="relative">
            <AtSign className="absolute left-3 top-3 w-4 h-4 text-[#D4AF37]/50" />
            <input name="username" required placeholder="Username unik (tanpa spasi)" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-[#D4AF37] outline-none" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-[#D4AF37]/50" />
            <input type="email" name="email" required placeholder="Email" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-[#D4AF37] outline-none" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-[#D4AF37]/50" />
            <input type="password" name="password" required placeholder="Password" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-[#D4AF37] outline-none" />
          </div>

          <button disabled={loading} className="w-full py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-xs text-[#F5F2EB]/50 mt-6">
          Sudah punya akun? <Link href="/login" className="text-[#D4AF37] hover:underline">Masuk</Link>
        </p>
      </div>
    </main>
  );
}