import { Client } from "appwrite";

export const createClient = () => {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "");
};
