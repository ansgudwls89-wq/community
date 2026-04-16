import type { Metadata } from 'next';
import { connection } from 'next/server';
import { supabase } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'NOL2 커뮤니티',
  description: 'NOL2 커뮤니티 게시글',
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ category: string; idx: string }>;
}) {
  await connection();
  const { category: encodedCategory, idx } = await params;
  const category = decodeURIComponent(encodedCategory);

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('idx', parseInt(idx))
    .single();

  if (error || !post) {
    return (
      <div style={{ padding: 40 }}>
        <h2>게시글을 찾을 수 없습니다.</h2>
        <p>DIAG error: {error?.message || 'no post'}</p>
        <a href={`/s/${encodedCategory}`}>← 목록으로</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: 'system-ui' }}>
      <div style={{ fontSize: 12, color: '#666' }}>DIAG: post loaded OK</div>
      <h1>{post.title}</h1>
      <p>category: {post.category} | idx: {post.idx} | id: {post.id}</p>
      <p>author: {post.author || '익명'}</p>
      <p>created_at: {post.created_at}</p>
      <p>views: {post.views ?? 0} | likes: {post.likes ?? 0}</p>
      <hr />
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{String(post.content || '').slice(0, 500)}</pre>
    </div>
  );
}
