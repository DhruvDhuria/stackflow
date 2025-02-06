import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { questionCollection, db, voteCollection, answerCollection } from "@/models/name";
import { Query } from "node-appwrite";
import QuestionCard from "@/components/QuestionCard";
import React from "react";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const Page = async ({searchParams}: {searchParams: Promise<{page?: string, search?: string, tag?: string}>}) => {
    const {page, search, tag} = await searchParams
    const Apage = page || "1"
    const limit = 20

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+Apage - 1) * limit),
        Query.limit(limit)
    ]

    if (search) {
        queries.push(
            Query.or([
                Query.equal("title", search),
                Query.equal("content", search)
            ])
        )
    }
    if (tag) queries.push(Query.equal("tags", tag));

    const questions = await databases.listDocuments(db, questionCollection, queries)
    // console.log("questions", questions)

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1)
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1)
                ])
            ])

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    name: author.name,
                    reputation: author.prefs.reputation
                }
            }
        })    
    )

    return (
        <div className="relative container mx-auto pt-20 pb-4 mt-8 px-4 sm:px-20">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
                <h1 className="sm:text-2xl text-lg font-semibold">All Questions</h1>
                <Link href={'/questions/ask'}>
                    <Button size={"sm"} className="sm:mt-0">Ask a question</Button>
                </Link>
            </div>
            <div className="mb-7">
                <Search />
            </div>
            <div className="pb-4">
                {questions.total} Questions
            </div>
            <div className="flex flex-col gap-3 mb-5">
                {questions.documents.map(ques => <QuestionCard key={ques.$id} ques={ques} />)}
            </div>
            <Pagination className="mx-auto" total={questions.total} limit={limit} />
        </div>
    )
    
}

export default Page;