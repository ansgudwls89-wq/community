import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import EditForm from './EditForm';


export default async function EditPostPage({
  params,
}: {
  params: Promise<{ category: string; idx: string }>;
}) {
  const { category: encodedCategory, idx } = await params;
  const category = decodeURIComponent(encodedCategory);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .single();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('idx', parseInt(idx))
    .single();

  if (!post) notFound();
  if (post.author !== profile?.nickname) {
    return (
      <div className="w-full p-10 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <p className="text-red-500 font-bold mb-4">수정 권한이 없습니다.</p>
        <a href={`/s/${encodedCategory}/${idx}`} className="text-blue-600 hover:underline text-sm">← 게시글로 돌아가기</a>
      </div>
    );
  }

  return (
    <EditForm
      post={{ id: post.id, idx: post.idx, title: post.title, content: post.content, category: post.category }}
    />
  );
}
