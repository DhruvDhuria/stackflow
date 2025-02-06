import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comments.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDb() {
    try {
        await databases.get(db)
        console.log("database connected")
    } catch (error) {
        try {
            await databases.create(db, db)
            console.log("Database created")

            // crete collections
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection()
            ])
            console.log("create collection successfully")
            console.log("Database connected")
        } catch (error) {
            console.log("Error creating databases and collections", error)
        }
    }

    return databases
}