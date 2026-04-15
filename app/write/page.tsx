import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default function WritePage() {
  async function createPost(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string || '익명';

    if (!title || !category || !content) {
      console.error('필수 입력 항목이 누락되었습니다.');
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert([
        { 
          title, 
          category, 
          content, 
          author,
          has_image: false,
          comments_count: 0,
          likes: 0,
          views: 0
        }
      ]);

    if (error) {
      console.error('글 작성 중 에러 발생:', error.message);
      return;
    }

    revalidatePath('/');
    redirect('/');
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <header className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-center sm:text-left transition-colors">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight transition-colors">새 글 작성</h1>
        </header>

        <form action={createPost} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1 transition-colors">Select Space</label>
              <select 
                name="category"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all appearance-none cursor-pointer transition-colors"
              >
                <option value="유머">유머</option>
                <option value="게임">게임</option>
                <option value="IT">IT</option>
                <option value="사회">사회</option>
                <option value="일상">일상</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1 transition-colors">Author</label>
              <input 
                type="text"
                name="author"
                placeholder="익명"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1 transition-colors">Title</label>
            <input 
              type="text"
              name="title"
              required
              placeholder="제목을 입력해 주세요"
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1 transition-colors">Content</label>
            <textarea 
              name="content"
              required
              placeholder="내용을 작성해 주세요"
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300 min-h-[300px] outline-none focus:ring-2 focus:ring-blue-600/50 transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 leading-relaxed transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-900 transition-colors">
            <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all px-4 py-2 transition-colors">취소</a>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-10 py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 transition-colors"
            >
              작성 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
