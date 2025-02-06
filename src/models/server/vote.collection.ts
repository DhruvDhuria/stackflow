import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  // create collection

  await databases.createCollection(db, voteCollection, voteCollection, [
    Permission.create("users"),
    Permission.update("users"),
    Permission.read("users"),
    Permission.delete("users"),
    Permission.read("any"),
  ]);
  console.log("Vote Collection created");

  await Promise.all([
    databases.createEnumAttribute(db, voteCollection, "type", ["answer", "question"], true),
    databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
    databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upvoted", "downvoted"], true),
    databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
  ])
  console.log("created vote attributes")
}
