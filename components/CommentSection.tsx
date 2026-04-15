'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();

    // Subscribe to ALL changes in comments table without server-side filter for maximum reliability
    const channel = supabase
      .channel(`realtime_comments_all`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        (payload) => {
          console.log('Global Realtime Event:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newComment = payload.new as Comment;
            // Filter by postId client-side
            if (Number(newComment.post_id) === Number(postId)) {
              setComments((prev) => {
                if (prev.some(c => c.id === newComment.id)) return prev;
                return [...prev, newComment];
              });
            }
          } else if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter(c => c.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedComment = payload.new as Comment;
            if (Number(updatedComment.post_id) === Number(postId)) {
              setComments((prev) => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, fetchComments]);

  // Handle successful comment submission
  const handleCommentSuccess = (newComment: Comment) => {
    setComments((prev) => {
      if (prev.some(c => c.id === newComment.id)) return prev;
      return [...prev, newComment];
    });
    setReplyToId(null);
  };

  // Build nested tree structure
  const commentTree = useMemo(() => {
    const map = new Map<number, Comment & { children: any[] }>();
    const roots: any[] = [];

    comments.forEach(comment => {
      map.set(comment.id, { ...comment, children: [] });
    });

    comments.forEach(comment => {
      const node = map.get(comment.id)!;
      if (comment.parent_id && map.has(comment.parent_id)) {
        map.get(comment.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [comments]);

  const CommentItem = ({ comment, depth = 0 }: { comment: any, depth?: number }) => (
    <div className={`group ${depth > 0 ? 'ml-4 sm:ml-8 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 mt-4' : 'border-b border-zinc-50 dark:border-zinc-900 pb-6 last:border-0'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black ${depth > 0 ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
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
        <button 
          onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
          className="text-[10px] font-black text-blue-600 dark:text-blue-500 hover:underline uppercase tracking-tighter"
        >
          {replyToId === comment.id ? 'Cancel' : 'Reply'}
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
        {comment.content}
      </p>

      {replyToId === comment.id && (
        <div className="mt-4 border-l-2 border-blue-500 pl-4">
          <CommentForm 
            postId={postId} 
            parentId={comment.id} 
            onSuccess={handleCommentSuccess}
            placeholder={`${comment.author}님께 답글 남기기...`}
            autoFocus
          />
        </div>
      )}

      {comment.children.map((child: any) => (
        <CommentItem key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* 메인 댓글 입력창 (상단으로 이동) */}
      <CommentForm postId={postId} onSuccess={handleCommentSuccess} />

      {/* 댓글 리스트 영역 */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 transition-colors">
        <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2 transition-colors">
          <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full"></span>
          Comments ({comments.length})
        </h2>

        {isLoading ? (
          <div className="py-10 text-center text-zinc-400 animate-pulse">댓글을 불러오는 중...</div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center text-zinc-400 italic text-sm">첫 번째 댓글을 남겨보세요!</div>
        ) : (
          <div className="space-y-8">
            {commentTree.map((rootComment) => (
              <CommentItem key={rootComment.id} comment={rootComment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
