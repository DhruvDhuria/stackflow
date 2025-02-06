import React from 'react'
import { db, answerCollection, questionCollection } from '@/models/name'
import { databases } from '@/models/server/config'
import { Query } from 'node-appwrite'
import { MarkDownPreview } from '@/components/RTE'
import Link from 'next/link'
import slugify from '@/utils/slugify'
import Pagination from '@/components/Pagination'

const page = async ({params, searchParams}: {params: {userId: string, userSlug: string}, searchParams: {page?: string}}) => {

    const { userId } = await params;
    let { page } = await searchParams;

    page = page || "1";

    const query = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25)
    ]

    const answers = await databases.listDocuments(db, answerCollection, query)

    answers.documents = await Promise.all(
        answers.documents.map(async ans => {
            try {
              const question = await databases.getDocument(db, questionCollection, ans.questionId, [
                  Query.select(["title"])
              ])
              return {
                  ...ans,
                  question
              }
            } catch (error: any) {
              console.log(error)
            }
            
            return ans
            
        })
    )

    

  return (
    <div className="px-4">
      <div className="mb-4">
        <p>{answers.total} answers</p>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {answers.documents.map((ans) => (
          <div key={ans.$id}>
            <div className=" max-h-40 overflow-auto">
              <MarkDownPreview
                source={ans.content}
                className="rounded-lg p-4 "
              />
            </div>
            {ans.question ?  <Link
              href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
              className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
            >
              Question
            </Link>: <p className='text-red-500'>The question has been deleted</p>}
          </div>
        ))}
      </div>
      <Pagination total={answers.total} limit={25} />
    </div>
  );
}

export default page