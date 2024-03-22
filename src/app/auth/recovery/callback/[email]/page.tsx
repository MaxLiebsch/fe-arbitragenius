import { changePasswordAction } from "@/server/actions/change-password";

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
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Stelle deinen{" "}
            <span className="inline-block -mb-2">
              <img
                className="mx-auto h-10 w-auto"
                src="/static/arbispotter_left-black.png"
                alt="Arbispotter"
              />
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
                className="block text-sm font-medium leading-6 text-gray-900"
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
                  Neues Passwort *
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

            <div className="space-y-2">
              <div className="flex flex-row justify-between">
                <a
                  className="text-blue-500 underline text-sm"
                  href="/auth/signup"
                >
                  Du hast keinen Account?
                </a>
                <a
                  className="text-blue-500 underline text-sm"
                  href="/auth/signin"
                >
                  Zum Login
                </a>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-chartreuse-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700"
              >
                Passwort aktualisieren
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
