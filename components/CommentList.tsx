'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel(`post_comments_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  async function fetchComments() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return <div className="p-10 text-center text-zinc-400 animate-pulse">댓글을 불러오는 중...</div>;
  }

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 transition-colors">
      <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors">
        <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full"></span>
        Comments ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <div className="py-10 text-center text-zinc-400 italic text-sm">첫 번째 댓글을 남겨보세요!</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="group border-b border-zinc-100 dark:border-zinc-900 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{comment.author}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">
                    {new Date(comment.created_at).toLocaleString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
