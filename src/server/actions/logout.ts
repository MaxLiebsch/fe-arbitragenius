"use client";
import { redirect } from "next/navigation";
import { deleteSession } from "./delete-session";

export async function logoutAction() {
  
  const response = await deleteSession()
  const {message} = response;
 return {message} 
}
