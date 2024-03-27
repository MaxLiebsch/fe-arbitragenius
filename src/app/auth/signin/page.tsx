"use client";

import { signinAction } from "@/server/actions/signin";
import { useFormState } from "react-dom";

export default function Page() {
  const [state, formAction] = useFormState(signinAction, { message: "" });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Signin to{" "}
            <span className="inline-block -mb-2">
              <img
                className="mx-auto h-10 w-auto"
                src="/static/arbispotter_left-black.png"
                alt="Arbispotter"
              />
            </span>
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address *
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-chartreuse-yellow-700 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password *
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-chartreuse-yellow-700 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-row justify-between">
                <a
                  className="text-blue-500 underline text-sm"
                  href="/auth/signup"
                >
                  Keinen Account?
                </a>
                <a
                  className="text-blue-500 underline text-sm"
                  href="/auth/recovery"
                >
                  Passwort vergessen?
                </a>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-chartreuse-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700"
              >
                Login
              </button>
              <div className="text-sm text-red-500">{state.message}</div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
