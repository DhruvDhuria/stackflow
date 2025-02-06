// get all user questions
import React from 'react'
import { answerCollection, db, questionCollection, voteCollection } from '@/models/name'
import { databases, users } from '@/models/server/config'
import { Query } from 'node-appwrite'
import { UserPrefs } from '@/store/Auth'
import QuestionCard from '@/components/QuestionCard'
import Pagination from '@/components/Pagination'

const Page = async ({params, searchParams}: {params: {userId: string, userSlug: string}, searchParams: {page?: string}},) => {

    let {page} = await searchParams
    page = page || "1"

    const {userId} = await params

    const questions = await databases.listDocuments(db, questionCollection, [
        Query.equal("authorId", userId),
        Query.offset((+page - 1) * 25),
        Query.orderDesc("$createdAt"),
        Query.limit(25)
    ])
    // console.log(questions)

    questions.documents = await Promise.all(
      questions.documents.map(async ques => {
        const [author, answers, votes] = await Promise.all([
          users.get<UserPrefs>(userId),
          databases.listDocuments(db, answerCollection, [
            Query.equal("questionId", ques.$id)
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", ques.$id)
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
      <div>
        <div className="px-4">
          <div className="mb-4">
            <p>{questions.total} questions</p>
          </div>
          <div className="mb-4 max-w-3xl space-y-6">
            {questions.documents.map((ques) => (
              <QuestionCard key={ques.$id} ques={ques} />
            ))}
          </div>
          <Pagination total={questions.total} limit={25} />
        </div>
      </div>
    );
}

export default Page