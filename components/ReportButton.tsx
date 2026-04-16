'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const supabase = createClient();

interface ReportButtonProps {
  targetType: 'post' | 'comment';
  targetId: number;
}

const REASONS = ['스팸/도배', '욕설/혐오표현', '개인정보 노출', '불법 콘텐츠', '기타'];

export default function ReportButton({ targetType, targetId }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!reason) { toast.error('신고 사유를 선택해 주세요.'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('신고는 로그인 후 이용 가능합니다.'); setIsOpen(false); return; }
    setIsSubmitting(true);
    try {
      await supabase.from('reports').insert([{
        target_type: targetType,
        target_id: targetId,
        reason,
        detail: detail.trim() || null,
      }]);
    } catch {}
    setIsSubmitting(false);
    setDone(true);
    setTimeout(() => { setIsOpen(false); setDone(false); setReason(''); setDetail(''); }, 1500);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-bold text-zinc-400 dark:text-zinc-700 hover:text-red-500 uppercase transition-colors px-4 py-2"
      >
        신고하기
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            {done ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-black text-zinc-900 dark:text-white">신고가 접수되었습니다</p>
              </div>
            ) : (
              <>
                <h2 className="text-sm font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-wide">신고하기</h2>
                <div className="space-y-2 mb-4">
                  {REASONS.map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-blue-600" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{r}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  value={detail}
                  onChange={e => setDetail(e.target.value)}
                  placeholder="상세 내용 (선택)"
                  rows={3}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 resize-none transition-all mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-sm py-2.5 rounded-xl transition-all disabled:opacity-50">
                    {isSubmitting ? '접수 중...' : '신고 접수'}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="flex-1 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm py-2.5 rounded-xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    취소
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
