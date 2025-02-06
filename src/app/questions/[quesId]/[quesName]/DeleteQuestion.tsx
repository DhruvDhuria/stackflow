"use client"

import { useAuthStore } from "@/store/Auth"
import { databases } from "@/models/client/config"
import { db, questionCollection, voteCollection } from "@/models/name"
import { useRouter } from "next/navigation"
import { IconTrash } from "@tabler/icons-react"

const DeleteQuestion = ({questionId, authorId}: {questionId: string, authorId: string}) => {
    const router = useRouter()
    const {user} = useAuthStore()

    const handleDelete = async () => {

        try {
            await databases.deleteDocument(db, voteCollection, questionId)
            await databases.deleteDocument(db, questionCollection, questionId)
            router.push("/questions")
        } catch (error: any) {
            console.log(error)
        }
    }

    return user?.$id === authorId ? (
        <button onClick={handleDelete} className="p-2 border border-gray-300 rounded-md hover:bg-gray-200">
            <IconTrash className="w-4 h-4" />
        </button>
    ) : null
}

export default DeleteQuestion