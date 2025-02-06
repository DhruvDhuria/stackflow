
import React from 'react'
import { MagicCard } from '@/components/ui/magic-card';
import { users,databases } from '@/models/server/config';
import { UserPrefs } from '@/store/Auth';
import { answerCollection, db, questionCollection } from '@/models/name';
import { Query } from 'node-appwrite';
import { NumberTicker } from '@/components/ui/number-ticker';



const Page = async ({params}: {params: {userId: string, userSlug: string}}) => {

  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(params.userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1)
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1)
    ]),
  ])
  return (
    <div className="flex h-[220px] w-full gap-3 justify-center">
      <MagicCard className="flex justify-center p-10 text-lg">
        <div>
          <h2>Reputation</h2>
        </div>
        <p>
          <NumberTicker value={user.prefs.reputation} />
        </p>
      </MagicCard>
      <MagicCard className="flex justify-center p-10 text-lg">
        <h2>Questions Asked</h2>
        <p>
          <NumberTicker value={questions.total} />
        </p>
      </MagicCard>
      <MagicCard className="flex justify-center p-10 text-lg">
        <h2>Answers Given</h2>
        <p>
          <NumberTicker value={answers.total} />
        </p>
      </MagicCard>
    </div>
  );
}

export default Page