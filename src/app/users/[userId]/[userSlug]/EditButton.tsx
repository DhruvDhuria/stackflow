"use client"

import { useAuthStore } from "@/store/Auth"
import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

const EditButton = () => {
    const {userId, userSlug} = useParams()
    const {user} = useAuthStore()

    if (user?.$id !== userId) return null

    return (
        <Link 
        className="border-2 border-white rounded-md px-2 py-1 bg-white text-black hover:bg-slate-200"
        href={`users/${userId}/${userSlug}/edit`}>
            Edit
        </Link>
    )
}

export default EditButton