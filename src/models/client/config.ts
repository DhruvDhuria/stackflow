import env from "@/app/env";
import { Client, Account, Avatars, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(env.apppwirte.endpoint) // Your API Endpoint
  .setProject(env.apppwirte.projectId); // Your project ID

const account = new Account(client);
const databases = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)


export {client, databases, account, avatars, storage}