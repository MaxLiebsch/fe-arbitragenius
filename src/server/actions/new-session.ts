import { SigninRequest } from "@/server/actions/signin";

export const createEmailPasswordSession = async (params: SigninRequest) => {

  const res = await fetch("/app/api/sessions/email", {
    method: "POST",
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (res.status === 201) {
    return { message: "success" };
  } else {
    if (data.type === "AppwriteException") {
      return { message: "Ungültige Anmeldedaten" };
    }
    return { message: "Etwas ist schief gelaufen ..." };
  }
};
