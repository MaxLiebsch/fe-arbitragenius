import { createSessionClient, getLoggedInUser } from "@/server/appwrite";
import { NextRequest } from "next/server";
import { z } from "zod";

const serializers: {
  [key: string]: {
    serialize: (input?: any) => string;
    deserialize: (input?: any) => any;
    fallback?: string;
  };
} = {
  favorites: {
    serialize(input?: any) {
      return z
        .array(z.string())
        .parse(input)
        .map((value) => value.trim().toLowerCase())
        .join(",");
    },
    deserialize(input?: any) {
      return typeof input === "string" ? input.split(",") : [];
    },
    fallback: JSON.stringify([]),
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const preferences = user.prefs as any;

  if (Object.keys(user.prefs).includes(params.key) && serializers[params.key]) {
    const value = serializers[params.key].deserialize(preferences[params.key]);
    return new Response(JSON.stringify(value));
  } else {
    return new Response(
      serializers[params.key]?.fallback ?? preferences[params.key] ?? ""
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { account } = await createSessionClient();
  const user = await account.get();
  if (!user) return new Response("unauthorized", { status: 401 });
  const preferences = { ...user.prefs } as any;
  const value = await request.json();
  preferences[params.key] =
    serializers[params.key]?.serialize(value) ?? JSON.stringify(value);
  account.updatePrefs(preferences);
  return new Response(undefined, { status: 200 });
}
