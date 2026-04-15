'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, [supabase.auth]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (isVoting) return;

    if (!userId) {
      alert('추천/비추천은 로그인 후 이용 가능합니다.');
      return;
    }

    setIsVoting(true);
    
    try {
      console.log(`Voting ${type} for post ${postId} as user ${userId}`);
      
      const { data, error } = await supabase.rpc('toggle_post_vote_v2', {
        target_post_id: postId,
        target_user_id: userId,
        target_vote_type: type
      });

      if (error) {
        console.error('RPC Error:', error);
        alert(`투표 중 오류가 발생했습니다: ${error.message}`);
      } else if (data && !data.success) {
        alert(data.message || '이미 투표하셨습니다.');
      } else {
        if (type === 'like') setLikes(prev => prev + 1);
        else setDislikes(prev => prev + 1);
        alert(type === 'like' ? '추천되었습니다.' : '비추천되었습니다.');
      }
    } catch (err) {
      console.error('Unexpected error during voting:', err);
      alert('투표 처리 중 예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="mt-16 mb-8 flex justify-center gap-4">
      <button 
        onClick={() => handleVote('like')}
        disabled={isVoting}
        className="flex items-center gap-2 px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-blue-600/10 hover:border-blue-500 transition-all group active:scale-95 shadow-lg disabled:opacity-50"
      >
        <span className="text-lg group-hover:scale-110 transition-transform">👍</span>
        <span className="text-[11px] font-black text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          추천 {likes}
        </span>
      </button>
      <button 
        onClick={() => handleVote('dislike')}
        disabled={isVoting}
        className="flex items-center gap-2 px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-red-600/10 hover:border-red-500 transition-all group active:scale-95 shadow-lg disabled:opacity-50"
      >
        <span className="text-lg group-hover:scale-110 transition-transform">👎</span>
        <span className="text-[11px] font-black text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          비추천 {dislikes}
        </span>
      </button>
    </div>
  );
}
