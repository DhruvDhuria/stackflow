"use client"

import React from "react"
import { useRouter } from "next/navigation"
import slugify from "@/utils/slugify"
import { useAuthStore } from "@/store/Auth"
import { Models } from "appwrite"
import QuestionForm from "@/components/QuestionForm"

const EditQues = ({question}: {question: Models.Document}) => {
    const {user} = useAuthStore()
    const router = useRouter()

    React.useEffect(() => {
        if (question.authorId !== user?.$id) {
            router.push(`/questions/${question.$id}/${slugify(question.title)}`)
        }

    }, [])
    if (user?.$id !== question.authorId) return null

    return (
        <div>
            <QuestionForm question={question} />
        </div>
    )
}

export default EditQues