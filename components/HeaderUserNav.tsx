import { createClient } from "@/utils/supabase/server";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

export default async function HeaderUserNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let newCommentCount = 0;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, avatar_url, energy, is_admin')
      .eq('id', user.id)
      .single();
    profile = data;

    if (profile?.nickname) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: countData } = await supabase
        .rpc('get_new_comment_count', { p_nickname: profile.nickname, p_since: since });
      newCommentCount = countData || 0;
    }
  }

  const userData = user ? {
    email: user.email,
    nickname: profile?.nickname,
    energy: profile?.energy,
    avatarUrl: profile?.avatar_url,
    newCommentCount,
    isAdmin: profile?.is_admin ?? false,
  } : null;

  return (
    <>
      <div className="hidden md:flex items-center gap-2">
        {userData ? (
          <>
            <ThemeToggle />
            <UserMenu user={userData} />
          </>
        ) : (
          <>
            <ThemeToggle />
            <a href="/login" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-sm font-bold px-3 py-2">로그인</a>
            <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/20 transition-all whitespace-nowrap">회원가입</a>
          </>
        )}
      </div>
      <MobileMenu user={userData} />
    </>
  );
}
