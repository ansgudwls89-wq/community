import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ nickname: string }> }): Promise<Metadata> {
  const { nickname } = await params;
  return { title: `${decodeURIComponent(nickname)}님의 프로필 — NOL2` };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ nickname: string }> }) {
  const { nickname: encodedNickname } = await params;
  const nickname = decodeURIComponent(encodedNickname);

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, avatar_url, energy, created_at')
    .eq('nickname', nickname)
    .single();

  if (!profile) notFound();

  const { data: posts } = await supabase
    .from('posts')
    .select('id, idx, category, title, views, likes, comments_count, created_at')
    .eq('author', nickname)
    .order('created_at', { ascending: false })
    .limit(20);

  const joinDate = new Date(profile.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
          <span className="text-blue-600 dark:text-blue-500">{profile.nickname}</span>님의 프로필
        </h1>
        <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">← 메인으로</a>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black text-white uppercase shadow-lg shadow-blue-500/30 overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.nickname} className="w-full h-full object-cover" />
            ) : (
              profile.nickname[0]
            )}
          </div>
          <div>
            <p className="text-xl font-black text-zinc-900 dark:text-white">{profile.nickname}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800/50">
                ⚡ {profile.energy || 0} 에너지
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold">{joinDate} 가입</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-zinc-900 dark:text-white">{posts?.length || 0}</div>
            <div className="text-[11px] font-bold text-zinc-400 mt-0.5">작성한 글</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-zinc-900 dark:text-white">{profile.energy || 0}</div>
            <div className="text-[11px] font-bold text-zinc-400 mt-0.5">에너지</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest">작성한 글 ({posts?.length || 0})</h2>
        </div>
        {!posts || posts.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 italic text-sm">작성한 글이 없습니다.</div>
        ) : (
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-[13px]">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group">
                  <td className="py-3 px-4">
                    <a href={`/s/${encodeURIComponent(post.category)}/${post.idx}`} className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</span>
                      <span className="text-[11px] font-black text-blue-600/80 flex-shrink-0">[{post.comments_count || 0}]</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">{post.category}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-[11px] text-zinc-400 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
