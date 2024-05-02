import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";

export default function useAccount() {
  return useQuery<Models.User<Models.Preferences>>({
    queryKey: ["user"],
    queryFn: async () => fetch("/app/api/user").then((resp) => resp.json()),
  });
}
