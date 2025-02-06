"use client"
import React, { ChangeEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MDEditor, {MarkDownPreview} from "./RTE"
import { useAuthStore } from "@/store/Auth"
import slugify from "@/utils/slugify"
import { storage, databases } from "@/models/client/config"
import { Models, ID } from "appwrite"
import { db, questionAttachmentBucket, questionCollection } from "@/models/name"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { IconX } from "@tabler/icons-react"




const LabelInputContainer = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn("flex flex-col w-full space-y-1 sm:space-y-2 my-3" , className)}>{children}</div>
  )
}


const QuestionForm = ({question}: {question?: Models.Document}) => {

    const {user} = useAuthStore()
    const router = useRouter()
    const [tag, setTag] = useState("")
    const [formData, setFormData] = useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: user?.$id,
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null
    })
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");


    const create = async () => {
        // if attachment is provided then store them in storage
        // else move on to store data
        // create the document from the retrived data and send response

        let storageResponse;
        if (formData.attachment) {
            storageResponse = await storage.createFile(questionAttachmentBucket, ID.unique(), formData.attachment)
        }

        const response = await databases.createDocument(db, questionCollection, ID.unique(), {
            title: formData.title,
            content: formData.content,
            authorId: user?.$id,
            tags: Array.from(formData.tags),
            attachmentId: storageResponse?.$id
        })

        return response
    }

    const update = async () => {
        if (!question) throw new Error("please provide a question");

        const attachmentId = await (async () => {
            if (!formData.attachment) return question?.attachmentId as string
            
            await storage.deleteFile(questionAttachmentBucket, question.attacmentId)

            const file = await storage.createFile(questionAttachmentBucket, ID.unique(), formData.attachment)

            return file.$id
        })()

        const updateResponse = await databases.updateDocument(db, questionCollection, question.$id, {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
            attachmentId: attachmentId
        })

        return updateResponse
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formData.title || !formData.content || formData.tags) {
          
          setError(() => "please fill all the fields")
        }


        setLoading(() => true)
        setError(() => "")

        try {
            const response = question ? await update() : await create()
            
            router.push(`/questions/${response.$id}/${slugify(formData.title)}`)
        } catch (error: any) {
            setError(() => error.message)
        } finally {
            setLoading(() => false)
        }


    }

    return (
      <form onSubmit={submit}>
        {error && (
          <div className="text-center">
            <span className="text-red-500">{error}</span>
          </div>
        )}
        {loading && (
          <span className="text-bold text-lg sm:text-2xl">submitting form</span>
        )}
        <LabelInputContainer>
          <Label htmlFor="title">
            Title
            <br />
            <small className="text-gray-300">
              Be specific and imagine you&apos;re asking a question to another
              person.
            </small>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="content">
            What are the details of your problem
            <br />
            <small className="text-gray-300 my-1">
              Introduce the problem and expand on what you put in the title.
              Minimum 20 characters.
            </small>
          </Label>
          <MDEditor
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value || "" }))
            }
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="tags">tags</Label>
          <Input
            id="image"
            name="image"
            accept="image/*"
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              setFormData((prev) => ({ ...prev, attachment: files[0] }));
            }}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="tag">
            Tags
            <br />
            <small className="text-gray-300 my-1">
              Add tags to describe what your question is about. Start typing to
              see suggestions.
            </small>
          </Label>
          <div className="w-full flex items-center ">
            <div className="w-full">
              <Input
                id="tag"
                name="tag"
                placeholder="e.g. (java c objective-c)"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="rounded-full px-4 py-2 m-2 border-white border"
              onClick={() => {
                if (tag.length === 0) return;
                setFormData((prev) => ({
                  ...prev,
                  tags: new Set([...Array.from(prev.tags), tag]),
                }));
                setTag("");
              }}
            >
              Add
            </button>
          </div>
          <div className="flex">
            {Array.from(formData.tags).map((tag, index) => (
              <div
                className="px-4 py-2 border border-white m-2 rounded-full"
                key={index}
              >
                <span>{tag}</span>
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: new Set(
                        Array.from(prev.tags).filter((t) => t !== tag)
                      ),
                    }))
                  }
                >
                  <IconX size={12} />
                </button>
              </div>
            ))}
          </div>
        </LabelInputContainer>
        <button
          type="submit"
          disabled={loading}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {question ? "Update" : "Publish"}
          </span>
        </button>
      </form>
    );
}


export default QuestionForm