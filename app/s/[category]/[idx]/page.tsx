import type { Metadata } from 'next';
import { connection } from 'next/server';
import sanitizeHtml from 'sanitize-html';
import PostActions from './PostActions';
import ShareButton from '@/components/ShareButton';
import BookmarkButton from '@/components/BookmarkButton';
import ViewRecorder from '@/components/ViewRecorder';
import VoteButtons from '@/components/VoteButtons';
import CommentSection from '@/components/CommentSection';
import ViewCounter from '@/components/ViewCounter';
import { supabase as publicSupabase } from '@/utils/supabase';
import { createClient } from '@/utils/supabase/server';


export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; idx: string }>;
}): Promise<Metadata> {
  const { category: encodedCategory, idx } = await params;
  const category = decodeURIComponent(encodedCategory);

  const { data: post } = await publicSupabase
    .from('posts')
    .select('title, content, author, created_at')
    .eq('category', category)
    .eq('idx', parseInt(idx))
    .single();

  if (!post) return { title: 'NOL2 커뮤니티' };

  const description = post.content
    ? post.content.replace(/<[^>]+>/g, '').slice(0, 160)
    : `${post.author || '익명'}님의 글`;

  return {
    title: `${post.title} — NOL2`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author || '익명'],
      tags: [category],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ category: string; idx: string }>;
}) {
  await connection();
  const { category: encodedCategory, idx } = await params;
  const category = decodeURIComponent(encodedCategory);

  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('idx', parseInt(idx))
    .single();

  if (error || !post) {
    return (
      <div className="w-full p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400 text-center transition-colors">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">게시글을 찾을 수 없습니다.</h2>
        <a href={`/s/${encodedCategory}`} className="text-blue-600 dark:text-blue-400 hover:underline">← 목록으로 돌아가기</a>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  let nickname = '';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user.id)
      .single();
    nickname = profile?.nickname || '';
  }

  const cleanContent = sanitizeHtml(post.content || '<p>본문 내용이 없습니다.</p>', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img', 'figure', 'figcaption']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ['src', 'allowfullscreen', 'frameborder', 'width', 'height', 'title', 'allow'],
      img: ['src', 'alt', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel'],
      '*': ['class', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowVulnerableTags: true,
  });

  return (
    <div className="w-full space-y-4">
      <ViewCounter postId={Number(post.id)} />
      <ViewRecorder id={post.id} idx={post.idx} title={post.title} category={post.category} />
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <header className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-[10px]">
            <a
              href={`/s/${encodeURIComponent(post.category)}`}
              className="font-black text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-all"
            >
              {post.category}
            </a>
            <span className="text-zinc-300 dark:text-zinc-700 font-bold">/</span>
            <span className="text-zinc-400 dark:text-zinc-600 font-bold tracking-tighter transition-colors">포스트 #{post.idx || post.id}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight leading-tight transition-colors">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500 transition-colors">
            <div className="flex items-center gap-3">
              {post.author && post.author !== '익명' && post.author !== '시스템' ? (
                <a href={`/profile/${encodeURIComponent(post.author)}`} className="font-black text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.author}
                </a>
              ) : (
                <span className="font-black text-zinc-700 dark:text-zinc-200">{post.author || '익명'}</span>
              )}
              <span className="text-zinc-200 dark:text-zinc-800">|</span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-4 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 dark:text-blue-500 animate-pulse transition-colors">●</span> 조회
                <span className="text-zinc-900 dark:text-zinc-100 font-black transition-colors">{post.views ?? 0}</span>
              </span>
              <span className="text-blue-600 dark:text-blue-500 transition-colors">추천 {post.likes ?? 0}</span>
              <span className="text-red-600 dark:text-red-500 transition-colors">비추천 {post.dislikes ?? 0}</span>
              <span className="text-zinc-600 dark:text-zinc-400 transition-colors">댓글 {post.comments_count ?? 0}</span>
            </div>
          </div>
        </header>

        <article className="p-6 sm:p-8 min-h-[300px] bg-white dark:bg-zinc-950 transition-colors">
          <div
            className="prose dark:prose-invert !max-w-none w-full text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed transition-colors"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          <VoteButtons postId={post.id} initialLikes={post.likes || 0} initialDislikes={post.dislikes || 0} />
        </article>

        <CommentSection postId={post.id} initialNickname={nickname} />

        <footer className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap justify-between gap-2 bg-zinc-50 dark:bg-zinc-950 items-center transition-colors">
          <div className="flex items-center gap-2">
            <a href={`/s/${encodeURIComponent(post.category)}`} className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all uppercase tracking-widest px-4 py-2 border border-zinc-200 dark:border-zinc-900 rounded-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors">
              ← 목록으로
            </a>
            <ShareButton />
            <BookmarkButton postId={post.id} title={post.title} category={post.category} idx={post.idx} />
          </div>
          <PostActions
            postId={post.id}
            category={post.category}
            idx={post.idx}
            author={post.author}
            currentNickname={nickname}
          />
        </footer>
      </div>
    </div>
  );
}
