"use client"

import { databases } from "@/models/client/config";
import React, {useState} from "react";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";
import { commentCollection, db } from "@/models/name";
import {ID, Models} from "appwrite";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const Comments = ({
    comments: _comments,
    type,
    typeId, 
    className  
}: {
    comments: Models.DocumentList<Models.Document>,
    type: "question" | "answer",
    typeId: string,
    className?: string
}) => {
    const [comments, setComments] = useState(_comments)
    const [newComment, setNewComment] = useState("")
    const {user} = useAuthStore()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newComment || !user) return;

        try {
            const response = await databases.createDocument(db, commentCollection, ID.unique(), {
                content: newComment,
                authorId: user.$id,
                type: type,
                typeId: typeId
            })

            setNewComment(() => "")
            setComments(prev => ({
                total: prev.total + 1,
                documents: [{...response, author: user}, ...prev.documents]
            }))
        } catch (error: any) {
            console.log(error)
            window.alert(error?.message || "Error creating a comment")
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await databases.deleteDocument(db, commentCollection, commentId)
            setComments(prev => ({
                total: prev.total - 1,
                documents: prev.documents.filter(comment => comment.$id !== commentId)
            }))
        } catch (error: any) {
            console.log(error)
            window.alert(error?.message || "Error deleting a comment")
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 pl-4", className)}>
        {
            comments.documents.map(comment => (
                <div key={comment.$id} className="flex flex-col gap-2">
                    <p>
                        {comment.content} - {" "}
                        <Link href={`/users/${comment.author.$id}/${slugify(comment.author.name)}`}>
                        {comment.author.name}
                        </Link>
                        <span>{convertDateToRelativeTime(new Date(comment.$createdAt))}</span>
                    </p>
                    {user?.$id === comment.author.$id && (
                        <button onClick={() => deleteComment(comment.$id)}>
                            <IconTrash className="w-4 shrink-0 h-4" />
                        </button>
                    )}
                </div>
            ))
        }
               
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                    className="bg-slate-800 rounded-xl p-2"
                    rows={1}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button type="submit" className="w-1/5 mr-auto">Add Comment</Button>
            </form>
        </div>
    )
    
}

export default Comments