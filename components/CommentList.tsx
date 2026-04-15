'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import CommentForm from './CommentForm';

interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
  parent_id: number | null;
}

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();

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
          const newComment = payload.new as Comment;
          setComments((prev) => [...prev, newComment]);
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
      .order('created_at', { ascending: true }); // 댓글은 시간순 정렬

    if (!error && data) {
      setComments(data);
    }
    setIsLoading(false);
  }

  // 중첩 구조 생성 함수
  const buildTree = (allComments: Comment[]) => {
    const map = new Map<number, Comment & { children: Comment[] }>();
    const roots: (Comment & { children: Comment[] })[] = [];

    allComments.forEach(comment => {
      map.set(comment.id, { ...comment, children: [] });
    });

    allComments.forEach(comment => {
      const node = map.get(comment.id)!;
      if (comment.parent_id) {
        const parent = map.get(comment.parent_id);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node); // 부모를 찾을 수 없는 경우(삭제 등) 루트로 취급
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const commentTree = buildTree(comments);

  if (isLoading) {
    return <div className="p-10 text-center text-zinc-400 animate-pulse">댓글을 불러오는 중...</div>;
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment & { children: Comment[] }, isReply?: boolean }) => (
    <div className={`group ${isReply ? 'ml-4 sm:ml-8 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 mt-4' : 'border-b border-zinc-50 dark:border-zinc-900 pb-6 last:border-0'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black ${isReply ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
            {comment.author}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">
            {new Date(comment.created_at).toLocaleString('ko-KR', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        {!isReply && (
          <button 
            onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
            className="text-[10px] font-black text-blue-600 dark:text-blue-500 hover:underline uppercase tracking-tighter"
          >
            {replyToId === comment.id ? 'Cancel' : 'Reply'}
          </button>
        )}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
        {comment.content}
      </p>

      {replyToId === comment.id && (
        <CommentForm 
          postId={postId} 
          parentId={comment.id} 
          onSuccess={() => setReplyToId(null)}
          placeholder={`${comment.author}님께 답글 남기기...`}
          autoFocus
        />
      )}

      {comment.children.map(child => (
        <CommentItem key={child.id} comment={child as any} isReply={true} />
      ))}
    </div>
  );

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 transition-colors">
      <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2 transition-colors">
        <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full"></span>
        Comments ({comments.length})
      </h2>

      {comments.length === 0 ? (
        <div className="py-10 text-center text-zinc-400 italic text-sm">첫 번째 댓글을 남겨보세요!</div>
      ) : (
        <div className="space-y-8">
          {commentTree.map((rootComment) => (
            <CommentItem key={rootComment.id} comment={rootComment} />
          ))}
        </div>
      )}
    </section>
  );
}
