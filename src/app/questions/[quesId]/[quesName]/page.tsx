import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { useAuthStore } from "@/store/Auth";
import {db, questionCollection, answerCollection, voteCollection, commentCollection, questionAttachmentBucket} from "@/models/name";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditQuestion  from "./EditQuestion";
import DeleteQuestion from "./DeleteQuestion";
import { databases, users } from "@/models/server/config";
import { avatars, storage } from "@/models/client/config";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";
import { UserPrefs } from "@/store/Auth";
import Link from "next/link";
import { Query } from "appwrite";
import VoteButtons from "@/components/VoteButtons";
import { MarkDownPreview } from "@/components/RTE";
import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";



const Page = async ({params}: {params: {quesId: string, quesName: string}}) => {

  const {quesId} = await params

    

    const [question, answers, upvotes, downvotes, comments] = await Promise.all([
        databases.getDocument(db, questionCollection, quesId),
        databases.listDocuments(db, answerCollection, [
            Query.equal("questionId", quesId),
            Query.orderDesc("$createdAt")
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", quesId),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1)
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", quesId),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1)
        ]),
        databases.listDocuments(db, commentCollection, [
            Query.equal("type", "question"),
            Query.equal("typeId", quesId),
            Query.orderDesc("$createdAt")
        ])
    ])


    let img;
    try {
       img = await storage.getFile(
        questionAttachmentBucket,
        question.attachmentId
      );
      
    } catch (error: any) {
      img = null
    }
    

    let previewImg;
    
    const author = await users.get<UserPrefs>(question.authorId);
    [comments.documents, answers.documents] = await Promise.all([
        Promise.all(comments.documents.map(async comment => {
            const author = await users.get<UserPrefs>(comment.authorId);
            return {
                ...comment, 
                author: {
                    $id: author.$id,
                    name: author.name,
                    reputation: author.prefs?.reputation
                }
            }
        })),
        Promise.all(answers.documents.map(async answer => {
            const [author, comments, upvotes, downvotes] = await Promise.all([
                users.get<UserPrefs>(answer.authorId),
                databases.listDocuments(db, commentCollection, [
                    Query.equal("type", "answer"),
                    Query.equal("typeId", answer.$id),
                    Query.orderDesc("$createdAt")
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "answer"),
                    Query.equal("typeId", answer.$id),
                    Query.equal("voteStatus", "upvoted"),
                    Query.limit(1)
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "answer"),
                    Query.equal("typeId", answer.$id),
                    Query.equal("voteStatus", "downvoted"),
                    Query.limit(1)
                ])
            ])

            comments.documents = await Promise.all(
                comments.documents.map(async comment => {
                    const author = await users.get<UserPrefs>(comment.authorId);
                    return {
                        ...comment, 
                        author: {
                            $id: author.$id,
                            name: author.name,
                            reputation: author.prefs?.reputation
                        }
                    }
                }
            ))

            return {
                ...answer,
                comments,
                upvotesDocuments: upvotes.total,
                downvotesDocuments: downvotes.total,
                author: {
                    $id: author.$id,
                    name: author.name,
                    reputation: author.prefs?.reputation
                }
            }
        }))
    ])

    return (
      <TracingBeam className="container relative pl-6">
        <Particles
          className="fixed inset-0 h-full w-full"
          quantity={500}
          ease={100}
          color="#ffffff"
          refresh
        />
        <div className="relative mx-auto px-4 pb-20 pt-36">
          <div className="flex">
            <div className="w-full">
              <h1 className="mb-1 text-3xl font-bold">{question.title}</h1>
              <div className="flex gap-4 text-sm">
                <span>
                  Asked{" "}
                  {convertDateToRelativeTime(new Date(question.$createdAt))}
                </span>
                <span>Answer {answers.total}</span>
                <span>Votes {upvotes.total + downvotes.total}</span>
              </div>
            </div>
            <Link
              href="/questions/ask"
              className="ml-auto inline-block shrink-0"
            >
              <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
          </div>
          <hr className="my-4 border-white/40" />
          <div className="flex gap-4">
            <div className="flex shrink-0 flex-col items-center gap-4">
              <VoteButtons
                type="question"
                id={question.$id}
                className="w-full"
                upvotes={upvotes}
                downvotes={downvotes}
              />
              <EditQuestion
                quesId={question.$id}
                quesName={question.title}
                authorId={question.authorId}
              />
              <DeleteQuestion
                questionId={question.$id}
                authorId={question.authorId}
              />
            </div>
            <div className="w-full overflow-auto">
              <MarkDownPreview
                className="rounded-xl p-4"
                source={question.content}
              />
              {img ? (
                <picture>
                  <img
                    src={storage.getFilePreview(
                      questionAttachmentBucket,
                      question.attachmentId,
                      0,
                      500
                    )}
                    alt={question.title}
                    className="mt-3 rounded-lg"
                  />
                </picture>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {question.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/questions?tag=${tag}`}
                    className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-1">
                <picture>
                  <img
                    src={avatars.getInitials(author.name, 36, 36)}
                    alt={author.name}
                    className="rounded-lg"
                  />
                </picture>
                <div className="block leading-tight">
                  <Link
                    href={`/users/${author.$id}/${slugify(author.name)}`}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    {author.name}
                  </Link>
                  <p>
                    <strong>{author.prefs.reputation}</strong>
                  </p>
                </div>
              </div>
              <Comments
                comments={comments}
                className="mt-4"
                type="question"
                typeId={question.$id}
              />
              <hr className="my-4 border-white/40" />
            </div>
          </div>
          <Answers answers={answers} questionId={question.$id} />
        </div>
      </TracingBeam>
    );
}

export default Page