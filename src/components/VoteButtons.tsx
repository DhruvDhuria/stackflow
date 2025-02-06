"use client";

import { useAuthStore } from "@/store/Auth";
import { databases } from "@/models/client/config";
import { voteCollection, db } from "@/models/name";
import {  Models, Query } from "appwrite";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";

const VoteButtons = (
  {
    type,
    id,
    upvotes,
    downvotes,
    className,
  }: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.DocumentList<Models.Document>;
    downvotes: Models.DocumentList<Models.Document>;
    className?: string
  },
) => {
    const [votedDocument, setVotedDocument] = React.useState<Models.Document | null>(null);
    const { user } = useAuthStore();
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total || 0);

    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                const response = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                if (response.total > 0) {
                    setVotedDocument(response.documents[0] || null);
                }
            }
        })()
    }, [user, type, id]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");
        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    typeId: id,
                    type: type,
                })
            })

            const data = await response.json()

            if (!response.ok) throw data
            
            
            setVotedDocument(() => data.data.document)
            setVoteResult(() => data.data.voteResult)
        } catch (error: any) {
            window.alert(error?.message || "Error voting")
        }
        
    }

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");
        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    typeId: id,
                    type: type,
                })
            })

            const data = await response.json()


            if (!response.ok) throw data

            setVotedDocument(() => data.data.document)
            setVoteResult(() => data.data.voteResult)
        } catch (error: any) {
            window.alert(error?.message || "Error voting")
        }
    }
    

    return (
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-start gap-y-4",
          className
        )}
      >
        <button
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
            votedDocument && votedDocument.voteStatus === "upvoted"
              ? "border-orange-500 text-orange-500"
              : "border-white/30"
          )}
          onClick={toggleUpvote}
        >
          <IconCaretUpFilled />
        </button>
        <span>{voteResult}</span>
        <button
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
            votedDocument && votedDocument.voteStatus === "downvoted"
              ? "border-orange-500 text-orange-500"
              : "border-white/30"
          )}
          onClick={toggleDownvote}
        >
          <IconCaretDownFilled />
        </button>
      </div>
    );
};

export default VoteButtons