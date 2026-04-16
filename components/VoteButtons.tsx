'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VoteButtonsProps {
  postId: number;
  initialLikes: number;
  initialDislikes: number;
}

export default function VoteButtons({ postId, initialLikes, initialDislikes }: VoteButtonsProps) {
  const supabase = createClient();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isVoting, setIsVoting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    const checkUserVote = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: voteData } = await supabase
          .from('post_votes')
          .select('vote_type')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();
        
        if (voteData) {
          setUserVote(voteData.vote_type as 'like' | 'dislike');
        }
      }
    };
    checkUserVote();
  }, [postId, supabase]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (isVoting) return;

    if (!userId) {
      toast.error('추천/비추천은 로그인 후 이용 가능합니다.');
      return;
    }

    setIsVoting(true);
    
    try {
      const { data, error } = await supabase.rpc('toggle_post_vote_v3', {
        target_post_id: postId,
        target_user_id: userId,
        target_vote_type: type
      });

      if (error) {
        toast.error(`투표 중 오류가 발생했습니다: ${error.message}`);
      } else if (data && data.success) {
        const action = data.action;
        if (action === 'added') {
          if (type === 'like') { setLikes(prev => prev + 1); setUserVote('like'); }
          else { setDislikes(prev => prev + 1); setUserVote('dislike'); }
          toast.success(type === 'like' ? '추천했습니다.' : '비추천했습니다.');
        } else if (action === 'cancelled') {
          if (type === 'like') setLikes(prev => Math.max(0, prev - 1));
          else setDislikes(prev => Math.max(0, prev - 1));
          setUserVote(null);
          toast('투표가 취소되었습니다.');
        } else if (action === 'changed') {
          if (type === 'like') {
            setLikes(prev => prev + 1); setDislikes(prev => Math.max(0, prev - 1)); setUserVote('like');
          } else {
            setDislikes(prev => prev + 1); setLikes(prev => Math.max(0, prev - 1)); setUserVote('dislike');
          }
          toast.success(type === 'like' ? '추천으로 변경되었습니다.' : '비추천으로 변경되었습니다.');
        }
      }
    } catch (err) {
      toast.error('투표 처리 중 오류가 발생했습니다.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="mt-16 mb-8 flex justify-center gap-4">
      <button 
        onClick={() => handleVote('like')}
        disabled={isVoting}
        className={`flex items-center gap-2 px-6 py-2 border rounded-xl transition-all group active:scale-95 shadow-lg disabled:opacity-50 ${
          userVote === 'like' 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-blue-600/10 hover:border-blue-500'
        }`}
      >
        <span className="text-lg group-hover:scale-110 transition-transform">👍</span>
        <span className={`text-[11px] font-black ${userVote === 'like' ? 'text-white' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors`}>
          추천 {likes}
        </span>
      </button>
      <button 
        onClick={() => handleVote('dislike')}
        disabled={isVoting}
        className={`flex items-center gap-2 px-6 py-2 border rounded-xl transition-all group active:scale-95 shadow-lg disabled:opacity-50 ${
          userVote === 'dislike' 
            ? 'bg-red-600 border-red-600 text-white' 
            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-red-600/10 hover:border-red-500'
        }`}
      >
        <span className="text-lg group-hover:scale-110 transition-transform">👎</span>
        <span className={`text-[11px] font-black ${userVote === 'dislike' ? 'text-white' : 'group-hover:text-red-600 dark:group-hover:text-red-400'} transition-colors`}>
          비추천 {dislikes}
        </span>
      </button>
    </div>
  );
}
