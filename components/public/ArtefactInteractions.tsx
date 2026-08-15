'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart, MessageSquare, Send, User, Trash2, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

interface ArtefactInteractionsProps {
  collectionId: string;
  initialLikeCount: number;
  initialComments: any[];
}

export default function ArtefactInteractions({
  collectionId,
  initialLikeCount,
  initialComments,
}: ArtefactInteractionsProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkUserAndLike = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUser(user);

        // Cek apakah user sudah Like pusaka ini
        const { data: likeData } = await supabase
          .from('collection_likes')
          .select('id')
          .eq('collection_id', collectionId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (likeData) setIsLiked(true);
      }
    };

    checkUserAndLike();
  }, [collectionId, supabase]);

  // Toggle Like / Suka Pusaka
  const handleToggleLike = async () => {
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk menyukai artefak ini.');
      return;
    }

    setLoadingLike(true);

    if (isLiked) {
      // Unlike
      await supabase
        .from('collection_likes')
        .delete()
        .eq('collection_id', collectionId)
        .eq('user_id', currentUser.id);

      setIsLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      // Like
      await supabase.from('collection_likes').insert({
        collection_id: collectionId,
        user_id: currentUser.id,
      });

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    setLoadingLike(false);
  };

  // Tambah Komentar Diskusi
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setPostingComment(true);

    const { data: commentData, error } = await supabase
      .from('collection_comments')
      .insert({
        collection_id: collectionId,
        user_id: currentUser.id,
        content: newComment.trim(),
      })
      .select(`
        id,
        content,
        created_at,
        user:profiles(full_name, username, avatar_url, is_verified)
      `)
      .single();

    if (!error && commentData) {
      setComments((prev) => [commentData, ...prev]);
      setNewComment('');
    } else if (error) {
      alert(`Gagal mengirim komentar: ${error.message}`);
    }

    setPostingComment(false);
  };

  // Hapus Komentar Sendiri
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Hapus komentar Anda?')) return;

    await supabase.from('collection_comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="space-y-10">
      {/* BARIS APRESIASI LIKES & JUMLAH DISKUSI */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-[#D4AF37]/30 bg-[#121212]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleLike}
            disabled={loadingLike}
            className={`p-3 rounded-full border transition-all flex items-center gap-2 ${
              isLiked
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-400 scale-105 shadow-lg'
                : 'bg-white/5 border-white/10 text-[#F5F2EB]/60 hover:text-rose-400 hover:border-rose-500/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-400' : ''}`} />
            <span className="text-xs font-bold font-mono">{likeCount}</span>
          </button>
          <span className="text-xs text-[#F5F2EB]/70 font-light hidden sm:inline">
            {isLiked ? 'Anda menyukai artefak ini' : 'Beri apresiasi untuk karya pusaka ini'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
          <MessageSquare className="w-4 h-4" />
          <span>{comments.length} Diskusi Komunitas</span>
        </div>
      </div>

      {/* SEKSI KOMENTAR & DISKUSI */}
      <section className="p-8 rounded-2xl border border-white/10 bg-[#121212] space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[#D4AF37]">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>Diskusi & Catatan Kurator</span>
          </h2>
          <span className="text-xs text-[#F5F2EB]/60 font-mono">
            {comments.length} Tanggapan
          </span>
        </div>

        {/* Form Tambah Komentar */}
        {currentUser ? (
          <form onSubmit={handleAddComment} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tuliskan apresiasi, pertanyaan dhapur/tangguh, atau wawasan historis Anda..."
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#F5F2EB] focus:border-[#D4AF37] outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={postingComment || !newComment.trim()}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-md"
              >
                {postingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Kirim Tanggapan</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
            <p className="text-xs text-[#F5F2EB]/70">
              Ingin ikut dalam diskusi kebudayaan ini?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-lg"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun Kolektor</span>
            </Link>
          </div>
        )}

        {/* Daftar Komentar */}
        <div className="space-y-4 pt-2">
          {comments && comments.length > 0 ? (
            comments.map((comm: any) => {
              const userObj = Array.isArray(comm.user) ? comm.user[0] : comm.user;
              const isOwner = currentUser?.id === comm.user_id;

              return (
                <div
                  key={comm.id}
                  className="p-4 rounded-xl border border-white/10 bg-[#1A1A1A] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#0D0D0D] border border-[#D4AF37]/50 overflow-hidden flex items-center justify-center shrink-0">
                        {userObj?.avatar_url ? (
                          <img
                            src={userObj.avatar_url}
                            alt={userObj.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                        )}
                      </div>

                      <div>
                        <Link
                          href={`/kolektor/${userObj?.username}`}
                          className="font-serif text-xs font-bold text-[#F5F2EB] hover:underline"
                        >
                          {userObj?.full_name || 'Kolektor'}
                        </Link>
                        <span className="text-[10px] text-[#D4AF37] font-mono ml-2">
                          @{userObj?.username}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#F5F2EB]/40 font-mono">
                        {new Date(comm.created_at).toLocaleDateString('id-ID')}
                      </span>
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteComment(comm.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Hapus komentar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#F5F2EB]/80 leading-relaxed font-light pl-9">
                    {comm.content}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-[#F5F2EB]/40 font-light">
              Belum ada tanggapan untuk artefak ini. Jadilah yang pertama berdiskusi!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}