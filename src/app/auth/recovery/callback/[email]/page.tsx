import { SubmitButton } from "@/components/FormSubmitBn";
import { Logo } from "@/components/Logo";
import { changePasswordAction } from "@/server/actions/change-password";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Input } from "antd";

export default function Page({
  params,
  searchParams,
}: {
  params: { email: string };
  searchParams: {
    userId: string;
    secret: string;
    expire: string;
  };
}) {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-dark">
            Stelle deinen{" "}
            <span className="inline-block -mb-2">
              <Logo />
            </span>{" "}
            Account wieder her
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={changePasswordAction}>
            <input
              id="email"
              name="email"
              defaultValue={decodeURIComponent(params.email)}
              className="hidden"
            />
            <input
              id="userId"
              name="userId"
              defaultValue={searchParams.userId}
              className="hidden"
            />
            <input
              id="secret"
              name="secret"
              defaultValue={searchParams.secret}
              className="hidden"
            />
            <input
              id="expire"
              name="expire"
              defaultValue={searchParams.expire}
              className="hidden"
            />
            <div>
              <label
                htmlFor="email-preview"
                className="block text-sm font-medium leading-6 text-gray-dark"
              >
                Email Addresse
              </label>
              <div className="mt-2">
                <input
                  id="email-preview"
                  name="email-preview"
                  type="email"
                  defaultValue={decodeURIComponent(params.email)}
                  disabled
                  className="block w-full rounded-md border-0 p-1.5 text-gray-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-chartreuse-yellow-700 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-dark"
                >
                  Neues Passwort *
                </label>
              </div>
              <div className="mt-2">
                <Input.Password
                  id="password"
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
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-row justify-between">
                <a
                  className="text-secondary underline text-sm"
                  href="/app/auth/signup"
                >
                  Du hast keinen Account?
                </a>
                <a
                  className="text-secondary underline text-sm"
                  href="/app/auth/signin"
                >
                  Zum Login
                </a>
              </div>
              <SubmitButton text="Passwort aktualisieren" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
