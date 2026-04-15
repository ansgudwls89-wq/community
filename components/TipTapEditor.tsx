'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';

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

    const { error: uploadError } = await supabase.storage
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
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-6 shadow-xl border border-zinc-200 dark:border-zinc-800',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline cursor-pointer font-bold hover:text-blue-500',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'rounded-xl shadow-lg my-6 aspect-video w-full max-w-2xl mx-auto border border-zinc-200 dark:border-zinc-800',
        },
      }),
      Placeholder.configure({
        placeholder: '여기에 내용을 작성하세요...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 sm:p-8 text-zinc-700 dark:text-zinc-300 leading-relaxed transition-colors',
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

  if (!editor) return null;

  const MenuButton = ({ onClick, isActive, label, icon }: { onClick: () => void, isActive?: boolean, label?: string, icon?: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center min-w-[32px] h-[32px] ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black' : 'text-zinc-500 dark:text-zinc-400'}`}
      title={label}
    >
      {icon ? <span className="text-sm">{icon}</span> : <span className="text-[11px] font-bold uppercase">{label}</span>}
    </button>
  );

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/30 transition-all shadow-lg">
      {/* Dynamic Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-sm">
        <MenuButton label="B" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
        <MenuButton label="I" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
        <MenuButton label="U" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} />
        <MenuButton label="S" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} />
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        
        <MenuButton label="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} />
        <MenuButton label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />
        <MenuButton label="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} />
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        
        <MenuButton icon="UL" label="Bullet" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
        <MenuButton icon="OL" label="Ordered" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
        <MenuButton icon="TL" label="Task" onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} />
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        
        <MenuButton icon="←" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} />
        <MenuButton icon="↔" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} />
        <MenuButton icon="→" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} />
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        
        <MenuButton label="“”" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />
        <MenuButton label="—" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <MenuButton label="🔗" onClick={() => {
          const url = window.prompt('URL을 입력하세요');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} isActive={editor.isActive('link')} />
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        
        <MenuButton label="🖼️" onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }
          };
          input.click();
        }} />
        
        <MenuButton label="📹" onClick={() => {
          const url = window.prompt('YouTube URL을 입력하세요');
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }} />

        <MenuButton label="田" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        
        <div className="flex-1"></div>
        
        <MenuButton icon="↶" onClick={() => editor.chain().focus().undo().run()} />
        <MenuButton icon="↷" onClick={() => editor.chain().focus().redo().run()} />
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
