'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/utils/supabase';
import CommentForm from './CommentForm';
import { updateCommentAction, deleteCommentAction } from '@/app/s/[category]/[idx]/actions';

interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  is_anonymous: boolean;
  ip_address: string | null;
}

interface CommentSectionProps {
  postId: number;
  initialNickname?: string;
}

export default function CommentSection({ postId, initialNickname }: CommentSectionProps) {
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
          if (payload.eventType === 'INSERT') {
            const newComment = payload.new as Comment;
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

  const handleCommentSuccess = (newComment: Comment) => {
    setComments((prev) => {
      if (prev.some(c => c.id === newComment.id)) return prev;
      return [...prev, newComment];
    });
    setReplyToId(null);
  };

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

  const maskIp = (ip: string | null) => {
    if (!ip) return '';
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
    return ip.slice(0, 8) + '...'; // For IPv6
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: any, depth?: number }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSaving, setIsSaving] = useState(false);
    const isAuthor = !!initialNickname && !comment.is_anonymous && initialNickname === comment.author;

    async function handleUpdate() {
      if (!editContent.trim()) return;
      setIsSaving(true);
      try {
        await updateCommentAction(comment.id, editContent);
        setIsEditing(false);
      } catch (e: any) {
        alert(e.message);
      } finally {
        setIsSaving(false);
      }
    }

    async function handleDelete() {
      if (!confirm('댓글을 삭제하시겠습니까?')) return;
      try {
        await deleteCommentAction(comment.id);
      } catch (e: any) {
        alert(e.message);
      }
    }

    return (
      <div className={`group ${depth > 0 ? 'ml-4 sm:ml-8 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 mt-4' : 'border-b border-zinc-50 dark:border-zinc-900 pb-6 last:border-0'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-black ${depth > 0 ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
              {comment.is_anonymous ? '익명' : comment.author}
            </span>
            <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mono">
              ({maskIp(comment.ip_address)})
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">
              {new Date(comment.created_at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthor && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="text-[10px] font-black text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-tighter transition-colors">수정</button>
                <button onClick={handleDelete} className="text-[10px] font-black text-zinc-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-tighter transition-colors">삭제</button>
              </>
            )}
            <button
              onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
              className="text-[10px] font-black text-blue-600 dark:text-blue-500 hover:underline uppercase tracking-tighter"
            >
              {replyToId === comment.id ? '취소' : '답글'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 resize-none transition-all"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setIsEditing(false); setEditContent(comment.content); }} className="text-xs font-bold text-zinc-400 hover:text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all">취소</button>
              <button onClick={handleUpdate} disabled={isSaving} className="text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">{isSaving ? '저장 중...' : '저장'}</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
        )}

        {replyToId === comment.id && (
          <div className="mt-4 border-l-2 border-blue-500 pl-4">
            <CommentForm postId={postId} parentId={comment.id} onSuccess={handleCommentSuccess} placeholder={`${comment.is_anonymous ? '익명' : comment.author}님께 답글 남기기...`} autoFocus initialNickname={initialNickname} />
          </div>
        )}

        {comment.children.map((child: any) => (
          <CommentItem key={child.id} comment={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <CommentForm postId={postId} onSuccess={handleCommentSuccess} initialNickname={initialNickname} />

      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 transition-colors">
        <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2 transition-colors">
          <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full"></span>
          댓글 ({comments.length})
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
