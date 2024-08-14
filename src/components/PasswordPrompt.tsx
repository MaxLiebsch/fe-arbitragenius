"use client";

import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";

const PasswordPrompt = () => {
  const [creds, setCreds] = useState({
    username: "username",
    password: "password",
  });
  useEffect(() => {
    const usernamePrompt = prompt("Enter username", "username");
    if (usernamePrompt !== "username" && usernamePrompt !== null) {
      setCreds((prev) => ({ ...prev, username: usernamePrompt }));
      const passwordPrompt = prompt("Enter password", "password");
      if (passwordPrompt !== "password" && passwordPrompt !== null) {
        setCreds((prev) => ({ ...prev, password: passwordPrompt }));
      }
    }
  }, []);

  useQuery({
    queryKey: ["terminal", "authentication"],
    enabled: !Boolean(
      creds.username === "username" && creds.password === "password"
    ),
    queryFn: async () => {
      try {
        await fetch(process.env.NEXT_PUBLIC_COCKPIT_URL!, {
          method: "HEAD",
        });
      } catch (error) {
        return "unauthorized";
      }
      const auth = await fetch(
        process.env.NEXT_PUBLIC_COCKPIT_URL + "/cockpit/login",
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${creds.username}:${creds.password}`
            )}`,
          },
        }
      );
      if(auth.ok) {
        return "success";
      }
      return "unauthorized";
    },
  });

  return <></>;
};

export default PasswordPrompt;
