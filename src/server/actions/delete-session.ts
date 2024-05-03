export const deleteSession = async () => {
  const res = await fetch("/app/api/sessions/current", {
    method: "DELETE",
  });
  const status = res.status;
  const data = status !== 204 ? await res.json() : null;
  
  if (status === 204) {
    return { message: "success" };
  } else {
    if (data.type === "AppwriteException") {
      return { message: data.message };
    }
    return { message: "Etwas ist schief gelaufen ..." };
  }
};
