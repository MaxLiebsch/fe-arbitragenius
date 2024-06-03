"use client";

import { SubmitButton } from "@/components/FormSubmitBn";
import { Logo } from "@/components/Logo";
import { signinAction } from "@/server/actions/signin";
import { useRef } from "react";
import { useFormState } from "react-dom";

const SignIn = () => {
  const [state, formAction] = useFormState(signinAction, { message: "" });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-secondary-950 flex justify-center space-x-3">
            <span>Anmelden bei </span>
            <span className="inline-block -mb-2">
              <Logo />
            </span>
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form ref={formRef} action={formAction}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Addresse *
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
                    Passwort *
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
                <div className="flex flex-row justify-between mb-3">
                  <a
                    className="text-secondary-950 underline text-sm"
                    href="/app/auth/signup"
                  >
                    Keinen Account?
                  </a>
                  <a
                    className="text-secondary-950 underline text-sm"
                    href="/app/auth/recovery"
                  >
                    Passwort vergessen?
                  </a>
                </div>
                <SubmitButton text="Login" />
                {Boolean(state?.message) && (
                  <div className="text-sm text-red-500 text-right">
                    ✗ {state?.message}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
