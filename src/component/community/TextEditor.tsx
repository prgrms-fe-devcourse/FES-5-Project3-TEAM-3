import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Button from '@/component/Button';

type Props = {
  value: string; // 현재 본문(HTML)
  onChange: (html: string) => void; // 본문 변경 콜백
  onInsertImages?: (files: File[]) => Promise<string[]> | string[];
  // 파일 업로드 → URL 배열 반환(에디터에 삽입)
};

export default function TextEditor({ value, onChange, onInsertImages }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      // StarterKit에 heading 허용
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image,
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-lg max-w-none min-h-[16rem] focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  const openFile = () => inputRef.current?.click();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !onInsertImages) return;
    const urls = await onInsertImages(files);
    urls.forEach((url) => editor?.chain().focus().setImage({ src: url }).run());
    // e.currentTarget.value = '';

    console.log(files);
  };

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 text-sm">
        <Button
          type="button"
          size="sm"
          borderType="outline"
          onMouseDown={(e) => e.preventDefault()}
          className={`px-2 py-1 ${editor?.isActive('bold') ? 'bg-primary-500 text-white' : ''}`}
          aria-pressed={editor?.isActive('bold') || false}
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
        >
          B
        </Button>

        <Button
          type="button"
          size="sm"
          borderType="outline"
          onMouseDown={(e) => e.preventDefault()}
          className={`px-2 py-1 ${editor?.isActive('italic') ? 'bg-primary-500 text-white' : ''}`}
          aria-pressed={editor?.isActive('italic') || false}
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
        >
          I
        </Button>

        <Button
          type="button"
          size="sm"
          borderType="outline"
          onMouseDown={(e) => e.preventDefault()}
          className={`px-2 py-1 ${editor?.isActive('underline') ? 'bg-primary-500 text-white' : ''}`}
          aria-pressed={editor?.isActive('underline') || false}
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
          }}
        >
          U
        </Button>

        {/* Heading H1/H2/H3 */}
        <Button
          type="button"
          size="sm"
          borderType="outline"
          onMouseDown={(e) => e.preventDefault()}
          className={`px-2 py-1 ${editor?.isActive('heading', { level: 1 }) ? 'bg-primary-500 text-white' : ''}`}
          aria-pressed={editor?.isActive('heading', { level: 1 }) || false}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>

        <Button
          type="button"
          size="sm"
          borderType="outline"
          onMouseDown={(e) => e.preventDefault()}
          className={`px-2 py-1 ${editor?.isActive('heading', { level: 2 }) ? 'bg-primary-500 text-white' : ''}`}
          aria-pressed={editor?.isActive('heading', { level: 2 }) || false}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>

        <Button
          type="button"
          size="sm"
          borderType="outline"
          onMouseDown={(e) => e.preventDefault()}
          className={`px-2 py-1 ${editor?.isActive('heading', { level: 3 }) ? 'bg-primary-500 text-white' : ''}`}
          aria-pressed={editor?.isActive('heading', { level: 3 }) || false}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>

        {/* 본문 전체 지우기 */}
        <Button
          type="button"
          size="sm"
          borderType="outline"
          className="px-2 py-1"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            // 에디터/상태 동기화
            editor.chain().clearContent().run();
            onChange(''); // 상위 상태에 반영
          }}
        >
          지우기
        </Button>

        <Button
          type="button"
          size="sm"
          borderType="outline"
          color="primary"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            openFile();
          }}
          className="px-2 py-1"
        >
          이미지
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* 본문 */}
      <div className="p-3">
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  );
}
