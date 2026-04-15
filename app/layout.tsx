import type { Metadata } from "next";
import "./globals.css";
import AdBanner from "@/components/AdBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import SpaceDropdown from "@/components/SpaceDropdown";
import SearchBar from "@/components/SearchBar";
import MobileMenu from "@/components/MobileMenu";
import UserMenu from "@/components/UserMenu";
import { supabase as supabaseAdmin } from "@/utils/supabase";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "NOL2 Style Community",
  description: "테마 기능을 지원하는 커뮤니티 플랫폼",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch categories for the dropdown
  const { data: posts } = await supabaseAdmin.from('posts').select('category');
  const categories = Array.from(new Set(posts?.map(p => p.category) || []));

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, avatar_url, energy')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  const userData = user ? {
    email: user.email,
    nickname: profile?.nickname,
    energy: profile?.energy
  } : null;

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 font-sans">
        <ThemeProvider>
          {/* 상단 고정 헤더 */}
          <header className="fixed top-0 w-full h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 z-50 transition-colors">
            <div className="max-w-[1400px] mx-auto h-full px-2 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex-shrink-0">
                <a href="/" className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter hover:text-blue-500 transition-colors">
                  NOL2.
                </a>
              </div>

              {/* 중앙 검색 영역 */}
              <div className="flex-1 max-w-3xl flex items-center gap-1 sm:gap-2 min-w-0">
                <SpaceDropdown initialCategories={categories} />
                <SearchBar />
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {/* Desktop Buttons */}
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
                {/* Mobile Menu Button */}
                <MobileMenu user={userData} />
              </div>
            </div>
          </header>

          <div className="max-w-[1440px] mx-auto pt-24 px-4 flex gap-4 w-full flex-1">
            <aside className="hidden lg:block w-[180px] flex-shrink-0">
              <div className="sticky top-24">
                <AdBanner label="왼쪽 광고" />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {children}
            </main>

            <aside className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-24">
                <AdBanner label="오른쪽 광고" />
              </div>
            </aside>
          </div>

          <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-12 mt-12 w-full transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 text-center">
              <div className="text-2xl font-black text-zinc-300 dark:text-zinc-800 mb-4 tracking-tighter transition-colors">NOL2.</div>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 font-medium transition-colors">&copy; 2026 NOL2 커뮤니티 플랫폼. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
