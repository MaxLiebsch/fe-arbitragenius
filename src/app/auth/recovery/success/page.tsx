import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-3">
          <img
            className="mx-auto h-10 w-auto"
            src="/static/arbispotter_left-black.png"
            alt="Arbispotter"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Passwort aktualisiert!
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <Link href="/auth/signin">
            <button className="flex w-full justify-center rounded-md bg-chartreuse-yellow-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-chartreuse-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chartreuse-yellow-700">
              Zurück zum Login
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
