import type { Metadata } from 'next';
import { connection } from 'next/server';

export const metadata: Metadata = {
  title: 'NOL2 커뮤니티',
  description: 'NOL2 커뮤니티 게시글',
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ category: string; idx: string }>;
}) {
  await connection();
  const { category, idx } = await params;
  return (
    <div style={{ padding: 40, fontFamily: 'system-ui' }}>
      <h1>DIAG: post route reachable</h1>
      <p>category: {decodeURIComponent(category)}</p>
      <p>idx: {idx}</p>
    </div>
  );
}
