import {Permission} from "node-appwrite"
import { db, answerCollection } from "../name"
import { databases } from "./config"


export default async function createAnswerCollection() {
    // create collection

    await databases.createCollection(db, answerCollection, answerCollection, [
        Permission.create("users"),
        Permission.update("users"),
        Permission.read("users"),
        Permission.delete("users"),
        Permission.read("any")
    ])
    console.log("Answers Collection created")

    // create attributes

    await Promise.all([
        databases.createStringAttribute(db, answerCollection, "content", 10000, true),
        databases.createStringAttribute(db, answerCollection, "questionId", 50, true),
        databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
    ])
    console.log("Answers attribute created")
}