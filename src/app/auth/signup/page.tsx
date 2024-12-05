"use client";

import { SubmitButton } from "@/components/FormSubmitBn";
import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import { signupAction } from "@/server/actions/signup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Input } from "antd";
import { useRef, useState } from "react";
import { useFormState } from "react-dom";

const SignUp = () => {
  const [state, formAction] = useFormState(signupAction, {
    message: "",
    formErrors: [],
    fieldErrors: {},
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const x = document.getElementById("password") as HTMLInputElement;
    const y = document.getElementById("retype_password") as HTMLInputElement;

    if (x.value && y.value && x.value !== y.value) {
      setPasswordError("Passwörter stimmen nicht überein");
    } else {
      setPasswordError(null);
      return;
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 pt-12 pb-44 md:py-12 lg:px-8 overflow-y-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="flex-col text-2xl font-bold leading-9 tracking-tight text-gray-dark flex">
          <div className="w-[200px] h-[70px] self-center">
            <Logo />
          </div>
          <span>Account erstellen</span>
        </h2>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form ref={formRef} action={formAction}>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-dark"
              >
                Email Addresse *
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="text-sm text-red-500 mt-1">
                {state?.fieldErrors?.email && state?.fieldErrors?.email[0]}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-dark"
              >
                Name
              </label>
              <div className="mt-2">
                <Input id="name" name="name" type="text" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-dark"
                >
                  Passwort *
                </label>
              </div>
              <div className="mt-2 gap-2 flex flex-col">
                <Input.Password
                  id="password"
                  onBlur={() => validate()}
                  name="password"
                  placeholder="Passwort"
                  iconRender={(visible) =>
                    visible ? (
                      <span className="h-4 w-4">
                        <EyeIcon className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="h-4 w-4">
                        <EyeSlashIcon className="h-4 w-4" />
                      </span>
                    )
                  }
                />
                <Input.Password
                  id="retype_password"
                  onBlur={() => validate()}
                  placeholder="Wiederholung Passwort"
                  iconRender={(visible) =>
                    visible ? (
                      <span className="h-4 w-4">
                        <EyeIcon className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="h-4 w-4">
                        <EyeSlashIcon className="h-4 w-4" />
                      </span>
                    )
                  }
                />
              </div>
              <div className="text-sm text-red-500 mt-1">
                {(state?.fieldErrors?.password &&
                  state?.fieldErrors.password[0]) ||
                  passwordError}
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
                    className="bg-secondary-600 h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary-500"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="terms" className="font-medium text-gray-dark">
                    Ich akzeptiere
                  </label>{" "}
                  die{" "}
                  <span>
                    <NavLink
                      target="_blank"
                      href="https://www.arbispotter.com/terms"
                    >
                      AGB
                    </NavLink>{" "}
                    und den{" "}
                    <NavLink
                      target="_blank"
                      href="https://www.arbispotter.com/privacy"
                    >
                      Datenschutz
                    </NavLink>
                  </span>
                  <span id="terms-description" className="text-gray">
                    <span className="sr-only">AGB und Datenschutz </span>
                  </span>
                </div>
              </div>
              <div className="text-sm text-red-500">
                {state?.fieldErrors?.terms && state?.fieldErrors.terms[0]}
              </div>
            </div>

            <div className="space-y-4">
              <a className="text-secondary underline" href="/app/auth/signin">
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
  );
};

export default SignUp;
