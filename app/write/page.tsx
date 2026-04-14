import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';

export default function WritePage() {
  async function createPost(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string || '익명';

    if (!title || !category || !content) {
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          title, 
          category, 
          content, 
          author,
          has_image: false,
          comments_count: 0,
          likes: 0
        }
      ])
      .select();

    if (error) {
      console.error('Error creating post:', error);
      return;
    }

    if (data) {
      redirect('/');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <header className="p-6 border-b border-zinc-800 bg-zinc-900/30">
          <h1 className="text-xl font-black text-white uppercase tracking-tight">새 글 작성</h1>
        </header>

        <form action={createPost} className="p-6 sm:p-8 space-y-6">
          {/* 스페이스 선택 및 작성자 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Select Space</label>
              <select 
                name="category"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all appearance-none cursor-pointer"
              >
                <option value="유머">유머</option>
                <option value="게임">게임</option>
                <option value="IT">IT</option>
                <option value="사회">사회</option>
                <option value="일상">일상</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Author (Optional)</label>
              <input 
                type="text"
                name="author"
                placeholder="익명"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Title</label>
            <input 
              type="text"
              name="title"
              required
              placeholder="제목을 입력해 주세요"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-base text-white font-bold outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* 본문 입력 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Content</label>
            <textarea 
              name="content"
              required
              placeholder="커뮤니티 가이드를 준수하여 내용을 작성해 주세요"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-zinc-300 min-h-[300px] outline-none focus:ring-2 focus:ring-blue-600/50 transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
            />
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-900">
            <a href="/" className="text-xs font-bold text-zinc-500 hover:text-white transition-all px-4 py-2">취소</a>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-10 py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              작성 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
