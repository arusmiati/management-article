"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/services/api"
import { FileImage, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Navbar from "@/app/admin/navbar"
import TextEditor from "@/components/ui/textEditor"
import Sidebar from "@/app/admin/sidebar"

interface Category {
  id: string
  name: string
}

export default function EditArticlePage() {
  const router = useRouter()
  const { id: articleId } = useParams()
  const fileRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [content, setContent] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ambil semua kategori
        const catRes = await api.get("/categories", {
          params: { page: 1, limit: 1000 },
        })
        setCategories(catRes.data?.data || catRes.data)

        // Ambil profil
        await api.get("/auth/profile")

        const previewData = sessionStorage.getItem("preview-article")
        if (previewData) {
          const { title, content, categoryId, thumbnail } = JSON.parse(previewData)
          setTitle(title)
          setContent(content)
          setCategoryId(categoryId)
          setThumbnailPreview(thumbnail)
          setUploadedImageUrl(thumbnail)
          sessionStorage.removeItem("preview-article")
        } else {
          const res = await api.get(`/articles/${articleId}`)
          const { title, content, imageUrl, category } = res.data
          setTitle(title)
          setContent(content)
          setCategoryId(category?.id || "")
          setUploadedImageUrl(imageUrl)
          setThumbnailPreview(imageUrl)
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err)
      }
    }

    if (articleId) {
      fetchInitialData()
    }
  }, [articleId])

  const chooseFile = () => fileRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      fileRef.current!.value = ""
    }
  }

  const clearThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview("")
    setUploadedImageUrl("")
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!uploadedImageUrl && !thumbnailFile) e.thumbnail = "Choose a thumbnail"
    if (!title.trim()) e.title = "Enter title"
    if (!categoryId) e.category = "Select category"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const uploadThumbnail = async () => {
    if (uploadedImageUrl || !thumbnailFile) return uploadedImageUrl
    const form = new FormData()
    form.append("image", thumbnailFile)
    const { data } = await api.post("/upload", form)
    setUploadedImageUrl(data.imageUrl)
    return data.imageUrl
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSaving(true)
    try {
      const imageUrl = await uploadThumbnail()
      const payload = { title, categoryId, content, imageUrl }
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Not authenticated")
      await api.put(`/articles/${articleId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push("/admin/articles")
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message ?? err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
        <Navbar />
        <div className="mt-6 px-4 md:px-8">
          <div className="p-6 max-w-7xl mx-auto border border-gray-300 rounded-md bg-white shadow-sm">
            <header className="flex items-center gap-2 mb-8">
              <Button variant="ghost" onClick={router.back}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="font-semibold text-gray-900">Edit Article</h1>
            </header>

            <div className="space-y-6">
              <Field label="Thumbnail" error={errors.thumbnail}>
                {thumbnailPreview ? (
                  <ThumbPreview src={thumbnailPreview} onChange={chooseFile} onDelete={clearThumbnail} />
                ) : (
                  <ThumbPicker onClick={chooseFile} />
                )}
                <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleFileChange} />
              </Field>

              <Field label="Title" error={errors.title}>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title" />
              </Field>

              <Field label="Category" error={errors.category}>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Content">
                <TextEditor content={content} onChange={setContent} />
              </Field>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.back()} className="text-gray-600 border-gray-300 hover:bg-gray-100">
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const previewData = {
                      title,
                      content,
                      categoryId,
                      thumbnail: thumbnailPreview || uploadedImageUrl
                    }
                    sessionStorage.setItem("preview-article", JSON.stringify(previewData))
                    router.push("/admin/articles/preview")
                  }}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Preview
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSaving ? "Saving..." : "Update"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block text-gray-700">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function ThumbPreview({ src, onChange, onDelete }: { src: string; onChange: () => void; onDelete: () => void }) {
  return (
    <div>
      <img src={src} alt="thumb" className="w-44 h-36 rounded-md object-cover" />
      <div className="flex gap-4 mt-2 text-xs">
        <button className="text-blue-600" onClick={onChange}>Change</button>
        <button className="text-red-600" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

function ThumbPicker({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="h-36 w-44 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 text-sm cursor-pointer"
    >
      <FileImage className="w-6 h-6 mb-1" />
      Click to select<br />jpg / png
    </div>
  )
}
