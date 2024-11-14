export const createVerification = async (url: string) => {

  const res = await fetch("/app/api/account/verification", {
    method: "POST",
    body: JSON.stringify({ url }),
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
