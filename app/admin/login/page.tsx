'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Landmark, Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md border border-[#D4AF37]/30 bg-black/80 backdrop-blur-md p-8 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Ornaments Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-3">
            <Landmark className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-serif text-[#D4AF37]">
            Gerbang Administrator
          </h1>
          <p className="text-xs text-[#F5F2EB]/60 mt-1 uppercase tracking-widest">
            Rumah Pusaka Banyumas
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2 font-medium">
              Pos-El Administrator (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rumahpusaka.or.id"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F5F2EB] placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2 font-medium">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F5F2EB] placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-medium text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-[#F5F2EB]/40 uppercase tracking-wider">
          Sistem Informasi Digital Museum & Database Koleksi
        </div>
      </div>
    </main>
  );
}