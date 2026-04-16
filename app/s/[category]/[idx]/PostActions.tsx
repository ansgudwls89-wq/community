'use client';

import { useRouter } from 'next/navigation';
import { deletePostAction } from '@/app/s/[category]/write/actions';
import ReportButton from '@/components/ReportButton';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { toast } from 'sonner';

interface PostActionsProps {
  postId: number;
  category: string;
  idx: number;
  author: string;
  currentNickname: string;
}

export default function PostActions({ postId, category, idx, author, currentNickname }: PostActionsProps) {
  const router = useRouter();
  const isAuthor = !!currentNickname && currentNickname === author;

  if (!isAuthor) {
    return <ReportButton targetType="post" targetId={postId} />;
  }

  async function handleDelete() {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await deletePostAction(postId, category);
    } catch (error: any) {
      if (isRedirectError(error)) return;
      toast.error(`삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/s/${encodeURIComponent(category)}/${idx}/edit`}
        className="text-[10px] font-bold text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase transition-colors px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
      >
        수정
      </a>
      <button
        onClick={handleDelete}
        className="text-[10px] font-bold text-zinc-400 hover:text-red-500 dark:hover:text-red-400 uppercase transition-colors px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        삭제
      </button>
    </div>
  );
}
