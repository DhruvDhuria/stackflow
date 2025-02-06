"use client"

import { Models } from 'appwrite'
import React, {useEffect, useRef, useState} from 'react'
import { BorderBeam } from './ui/border-beam';
import Link from 'next/link';
import slugify from '@/utils/slugify';
import convertDateToRelativeTime from '@/utils/relativeTime';
import { avatars } from '@/models/client/config';

function QuestionCard({ques}: {ques: Models.Document}) {

    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    /*
     Things i want to display in the question card
     1. title
     2. author name & profile
     3. votes
     4. answers given
    */
    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref]);

    // console.log(ques)
    
  return (
    <div
      ref={ref}
      className="flex relative gap-2 overflow-hidden rounded-xl border border-white p-2"
    >
      <BorderBeam size={height} duration={10} delay={9} />
      <div className="text-xs sm:text-sm p-2 relative shrink-0">
        <p>{ques.totalVotes} votes</p>
        <p>{ques.totalAnswers} answers</p>
      </div>
      <div className="flex flex-col w-[100%] gap-2">
        <Link href={`/questions/${ques.$id}/${slugify(ques.title)}`}>
          <h2 className="text-md sm:text-lg hover:text-gray-200">{ques.title}</h2>
        </Link>
        <div className="flex gap-2 ml-auto justify-between w-[100%] text-xs">
          <div>
            {ques.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/questions?tag=${tag}`}
                className="inline-block rounded-lg bg-white/10 px-1 sm:px-2 py-0.5 duration-200 hover:bg-white/20"
              >
                <span className="text-xs sm:text-sm text-slate-400">{tag}</span>
              </Link>
            ))}
          </div>
          <div className="flex text-xs sm:text-sm flex-col sm:flex-row gap-1">
            <div className='flex gap-1'>
              <picture className="w-3 h-3 m-0 sm:w-4 sm:h-4">
                <img
                  src={avatars.getInitials(ques.author.name, 24, 24)}
                  alt={ques.author.name}
                />
              </picture>
              <Link
                href={`/users/${ques.authorId}/${slugify(ques.author.name)}`}
              >
                {ques.author.name}
              </Link>
              <strong>&quot;{ques.author.reputation}&quot;</strong>
            </div>
            <span>
              asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard