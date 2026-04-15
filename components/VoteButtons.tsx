'use client';

import { supabase } from '@/utils/supabase';
import { useState } from 'react';

interface VoteButtonsProps {
  postId: number;
  initialLikes: number;
  initialDislikes: number;
}

export default function VoteButtons({ postId, initialLikes, initialDislikes }: VoteButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isVoting, setIsSubmitting] = useState(false);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (isVoting) return;

    // 로컬 스토리지에 투표 여부 저장 (간단한 중복 방지)
    const voteKey = `vote_${postId}`;
    const alreadyVoted = localStorage.getItem(voteKey);
    
    if (alreadyVoted) {
      alert('이미 투표하셨습니다.');
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.rpc('toggle_post_vote', {
      target_post_id: postId,
      vote_type: type
    });

    if (error) {
      console.error('Error voting:', error.message);
      alert('투표 중 오류가 발생했습니다.');
    } else {
      if (type === 'like') setLikes(prev => prev + 1);
      else setDislikes(prev => prev + 1);
      
      localStorage.setItem(voteKey, 'true');
    }
    
    setIsSubmitting(false);
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
          비추천 {dislikes || 0}
        </span>
      </button>
    </div>
  );
}
