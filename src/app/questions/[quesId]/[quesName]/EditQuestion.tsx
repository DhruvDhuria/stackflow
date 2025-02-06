"use client"

import Link from "next/link"
import slugify from "@/utils/slugify"
import React from "react"
import { useAuthStore } from "@/store/Auth"
import { IconEdit } from "@tabler/icons-react"

const EditQuestion = ({quesId, quesName, authorId}: {quesId: string, quesName: string, authorId: string}) => {
    const {user} = useAuthStore()
    return user?.$id === authorId ? (
        <Link href={`/questions/${quesId}/${slugify(quesName)}/edit`} className="p-2 border border-gray-300 rounded-md hover:bg-gray-200"><IconEdit className="w-4 h-4" /></Link>
    )   : null
}

export default EditQuestion