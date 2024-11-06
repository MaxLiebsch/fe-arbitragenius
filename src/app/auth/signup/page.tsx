"use client";

import { SubmitButton } from "@/components/FormSubmitBn";
import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import { signupAction } from "@/server/actions/signup";
import { useRef } from "react";
import { useFormState } from "react-dom";

const SignUp = () => {
  const [state, formAction] = useFormState(signupAction, {
    message: "",
    formErrors: [],
    fieldErrors: {},
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 flex items-center space-x-2">
            <span className="inline-block -mb-2">
              <Logo />
            </span>{" "}
            <span>Account erstellen</span>
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
                <div className="text-sm text-red-500 mt-1">
                  {state?.fieldErrors.email}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
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
                <div className="text-sm text-red-500 mt-1">
                  {state?.fieldErrors.password}
                </div>
              </div>

              <div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="terms"
                      aria-describedby="terms-description"
                      name="terms"
                      type="checkbox"
                      className="bg-secondary-600 h-4 w-4 rounded border-gray-300 text-secondary-950 focus:ring-secondary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-900"
                    >
                      Ich stimme
                    </label>{" "}
                    den
                    <span>
                      <NavLink
                        target="_blank"
                        href="https://www.arbispotter.com/terms"
                      >
                        AGB
                      </NavLink>{" "}
                      und dem{" "}
                      <NavLink
                        target="_blank"
                        href="https://www.arbispotter.com/privacy"
                      >
                        Datenschutz
                      </NavLink>
                    </span>
                    <span id="terms-description" className="text-gray-500">
                      <span className="sr-only">AGB und Datenschutz </span>zu.
                    </span>
                  </div>
                </div>
                <div className="text-sm text-red-500">
                  {state?.fieldErrors.terms}
                </div>
              </div>
              <div className="space-y-1">
                <a className="text-secondary-950 underline" href="/app/auth/signin">
                  Du hast bereits ein Account?
                </a>
                <SubmitButton text="Registrieren" />
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

export default SignUp;
