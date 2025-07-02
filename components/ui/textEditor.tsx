'use client'

import { useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import {
  Bold, Italic, List, ListOrdered, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Image as ImageIcon
} from "lucide-react"

export default function TextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (value: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    editable: true,
    autofocus: true,
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content && editor.getHTML() === '<p></p>') {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const insertImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result?.toString()
      if (url) {
        editor?.chain().focus().setImage({ src: url }).run()
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'text-blue-600' : ''}>
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'text-blue-600' : ''}>
          <Italic className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'text-blue-600' : ''}>
          <List className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'text-blue-600' : ''}>
          <ListOrdered className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
          <AlignLeft className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
          <AlignCenter className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
          <AlignRight className="w-4 h-4" />
        </button>
        <button onClick={() => editor?.chain().focus().setTextAlign('justify').run()}>
          <AlignJustify className="w-4 h-4" />
        </button>
        <button onClick={handleImageUpload}>
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) insertImage(file)
          }}
        />
      </div>

      <div className="min-h-[200px] p-4">
        <EditorContent
          editor={editor}
          className="prose max-w-none outline-none whitespace-pre-wrap"
        />
      </div>
    </div>
  )
}
