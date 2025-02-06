import { questionAttachmentBucket } from "../name";
import { storage } from "./config";
import { Permission } from "node-appwrite";

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket)
        console.log("Storage connected")
    } catch (error) {
        try {
            await storage.createBucket(questionAttachmentBucket, questionAttachmentBucket, [
                Permission.create("users"),
                Permission.read("any"),
                Permission.read("users"),
                Permission.update("users"),
                Permission.delete("users"),
            ],
            false,
            undefined,
            undefined,
            ["jpg", "gif", "jpeg", "webp", "heic", "png"]
            )
            console.log("Storage created")
            console.log("Storage connected")

        } catch (error) {
            console.log("error creating storage", error)
        }
    }
}
