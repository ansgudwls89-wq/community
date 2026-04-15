'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { supabase } from '@/utils/supabase';
import { useCallback } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const uploadImage = useCallback(async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `post-images/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-md',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            uploadImage(file).then(url => {
              if (url) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            uploadImage(file).then(url => {
              if (url) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/50 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500'}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500'}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500'}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-800 text-blue-600' : 'text-zinc-500'}`}
          title="Ordered List"
        >
          1. List
        </button>
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        <button
          type="button"
          onClick={addImage}
          className="p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors"
          title="Insert Image by URL"
        >
          🖼️ URL
        </button>
        <label className="p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors cursor-pointer" title="Upload Image">
          🖼️ Upload
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
      
      <style jsx global>{`
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .prose p { margin: 0.5rem 0; }
        .prose h1 { font-size: 1.5rem; font-weight: 800; margin: 1.5rem 0 1rem; }
        .prose h2 { font-size: 1.25rem; font-weight: 700; margin: 1.25rem 0 0.75rem; }
        .prose blockquote { border-left: 4px solid #e2e8f0; padding-left: 1rem; italic; margin: 1rem 0; }
      `}</style>
    </div>
  );
}
