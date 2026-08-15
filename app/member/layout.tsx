'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import MemberSidebar from '@/components/member/MemberSidebar';
import MemberHeader from '@/components/member/MemberHeader';

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{
    email?: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  }>({});

  const supabase = createClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url, email')
          .eq('id', user.id)
          .single();

        setProfile({
          email: user.email,
          full_name: data?.full_name,
          username: data?.username,
          avatar_url: data?.avatar_url,
        });
      }
    };

    fetchUserProfile();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F2EB] flex">
      <MemberSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        username={profile.username}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <MemberHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          userEmail={profile.email}
          fullName={profile.full_name}
          username={profile.username}
          avatarUrl={profile.avatar_url}
        />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}