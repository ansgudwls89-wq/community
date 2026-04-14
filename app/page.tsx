export default function Home() {
  const mockPosts = [
    { id: 1, title: "이번에 출시된 게임 해보신 분?", channel: "게임", author: "유저1", date: "2분 전", comments: 12 },
    { id: 2, title: "오늘 점심 뭐 먹을까요?", channel: "자유", author: "유저2", date: "5분 전", comments: 5 },
    { id: 3, title: "최신 IT 뉴스 모음", channel: "IT뉴스", author: "에디터", date: "10분 전", comments: 24 },
    { id: 4, title: "컴퓨터 견적 좀 봐주세요", channel: "컴퓨터", author: "컴린이", date: "15분 전", comments: 8 },
    { id: 5, title: "고양이 사진 보고 가세요", channel: "반려동물", author: "애묘가", date: "20분 전", comments: 45 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">전체 게시글</h2>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">최신순</button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50">인기순</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-2 w-16 text-center">채널</th>
              <th className="px-4 py-2">제목</th>
              <th className="px-4 py-2 w-24 text-center">작성자</th>
              <th className="px-4 py-2 w-20 text-center">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockPosts.map((post) => (
              <tr key={post.id} className="hover:bg-blue-50/30 cursor-pointer">
                <td className="px-4 py-3 text-center">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {post.channel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 line-clamp-1">{post.title}</span>
                    <span className="text-xs text-blue-600 font-bold">[{post.comments}]</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-500">{post.author}</td>
                <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 게시글 목록 하단 버튼 */}
      <div className="flex justify-end">
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors">
          글쓰기
        </button>
      </div>
    </div>
  );
}
