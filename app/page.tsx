export default function Home() {
  const posts = [
    { 
      id: 1, 
      title: "2026년 최고의 오픈월드 게임은 무엇일까요?", 
      channel: "게임 라운지", 
      author: "김게이머", 
      time: "10분 전", 
      comments: 142, 
      likes: 85,
      preview: "내년에 출시 예정인 신작들 중에서 벌써부터 기대되는 작품들이 많네요. 여러분은 어떤 게임을 가장 기다리고 계신가요?"
    },
    { 
      id: 2, 
      title: "새로운 M4 칩 성능 체감이 확실하네요", 
      channel: "IT & 테크", 
      author: "애플유저", 
      time: "25분 전", 
      comments: 48, 
      likes: 32,
      preview: "어제 수령해서 이것저것 돌려보고 있는데, 기존 모델보다 확실히 빠릿빠릿한 느낌입니다. 영상 편집 하시는 분들께 추천드려요."
    },
    { 
      id: 3, 
      title: "서울 맛집 탐방 후기 (스압주의)", 
      channel: "오늘의 일상", 
      author: "맛객", 
      time: "1시간 전", 
      comments: 215, 
      likes: 120,
      preview: "이번 주말에 다녀온 성수동 맛집 5곳 리뷰입니다. 개인적으로 세 번째 집이 가장 맛있었네요."
    }
  ];

  return (
    <div className="space-y-6">
      {/* 필터 및 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg transition-all">최신글</button>
          <button className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-all">인기글</button>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
          <span>새 글 작성</span>
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="card p-6 cursor-pointer group hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md">{post.channel}</span>
              <span className="text-xs text-slate-400">• {post.time}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              {post.preview}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">{post.author}</span>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <span className="text-sm">❤️ {post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                    <span className="text-sm">💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 페이지네이션 (간소화) */}
      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          더 많은 게시글 불러오기
        </button>
      </div>
    </div>
  );
}
