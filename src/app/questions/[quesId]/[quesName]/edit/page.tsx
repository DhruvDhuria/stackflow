import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import EditQues from "./EditQues";
import React from "react";

const Page = async ({params}: {params: {quesId: string, quesName: string}}) => {
    const {quesId} = await params
    const question = await databases.getDocument(db, questionCollection, quesId)
   
    return (
        <div className="min-h-screen w-full justify-center items-center p-12 mt-16 px-20">
            <EditQues question={question} /> 
        </div>
    )
}
export default Page