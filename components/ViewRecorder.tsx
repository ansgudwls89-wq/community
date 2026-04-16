'use client';

import { useEffect } from 'react';
import { recordView } from './RecentlyViewed';

interface ViewRecorderProps {
  id: number;
  idx: number;
  title: string;
  category: string;
}

export default function ViewRecorder({ id, idx, title, category }: ViewRecorderProps) {
  useEffect(() => {
    recordView({ id, idx, title, category });
  }, [id, idx, title, category]);

  return null;
}
