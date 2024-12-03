import { Models } from "appwrite";

function flatten(data: any, prefix = "") {
  let output = {} as any;

  for (const [key, value] of Object.entries(data)) {
    let finalKey = prefix ? prefix + "[" + key + "]" : key;

    if (Array.isArray(value)) {
      output = { ...output, ...flatten(value, finalKey) };
    } else {
      output[finalKey] = value;
    }
  }

  return output;
}

export async function getSubscriptions(
  userId: string
): Promise<
  Models.DocumentList<
    { userId: string; customer: string; subscription: string } & Models.Document
  >
> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_CUSTOMER_DB_ID}/collections/${process.env.NEXT_CUSTOMER_SUBSCRIPTION_ID}/documents`
  );

  url.search = new URLSearchParams(
    flatten({
      queries: [
        JSON.stringify({
          method: "equal",
          attribute: "userId",
          values: [userId],
        }),
      ],
    })
  ).toString();

  const response = await fetch(url.toString(), {
    method: "GET",
    // @ts-ignore
    headers: {
      "content-type": "application/json",
      "x-appwrite-project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
      "x-appwrite-key": process.env.NEXT_APPWRITE_KEY,
    },
    cache: "no-store",
  });

  if (response.ok) return response.json();
  else
    return {
      total: 0,
      documents: [],
    };
}
