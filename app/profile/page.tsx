import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient';


export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 프로필 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, energy, avatar_url, updated_at')
    .eq('id', user.id)
    .single();

  // 작성한 글 조회 (최신 50개)
  const { data: posts } = await supabase
    .from('posts')
    .select('id, idx, category, title, views, likes, comments_count, created_at')
    .eq('author', profile?.nickname || '')
    .order('created_at', { ascending: false })
    .limit(50);

  // 작성한 댓글 조회 (최신 50개, 게시글 정보 포함)
  const { data: comments } = await supabase
    .from('comments')
    .select('id, content, created_at, post_id, posts(idx, category, title)')
    .eq('author', profile?.nickname || '')
    .order('created_at', { ascending: false })
    .limit(50);

  const profileData = {
    id: user.id,
    nickname: profile?.nickname || '',
    avatar_url: profile?.avatar_url || null,
    email: user.email || '',
    energy: profile?.energy || 0,
    created_at: user.created_at,
  };

  return (
    <ProfileClient
      profile={profileData}
      posts={posts || []}
      comments={(comments || []).map((c) => ({
        ...c,
        posts: Array.isArray(c.posts) ? c.posts[0] ?? null : c.posts ?? null,
      }))}
    />
  );
}
