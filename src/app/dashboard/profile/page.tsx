"use client";

import { Button } from "@/components/Button";
import { SubmitButton } from "@/components/FormSubmitBn";
import useAccount from "@/hooks/use-account";
import { Tab } from "@headlessui/react";
import React, { useEffect } from "react";

const secondaryNavigation = [
  { name: "Account", href: "#", current: true },
  { name: "Einstellungen", href: "#", current: false },
  { name: "Rechungen", href: "#", current: false },
  { name: "Benachrichtigungen", href: "#", current: false },
];

const Page = () => {
  const account = useAccount();

  useEffect(() => {}, [account.data]);

  return (
    <>
      <Tab.Group>
        <header className="border-b border-white/5">
          {/* Secondary navigation */}
          <nav className="flex overflow-x-auto py-4">
            <Tab.List className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8">
              {secondaryNavigation.map((item) => (
                <Tab key={item.name}>
                  {({ selected }) => (
                    <div
                      key={item.name}
                      className={selected ? "text-primary-950" : ""}
                    >
                      {item.name}
                    </div>
                  )}
                </Tab>
              ))}
            </Tab.List>
          </nav>
        </header>
        <Tab.Panels>
          <Tab.Panel>
            <div className="divide-y divide-white/5">
              <h1 className="sr-only">Account Einstellungen</h1>
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Persönliche Informationen
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Verwenden Sie eine ständige Adresse, an der Sie Post
                    empfangen können.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    {/* <div className="col-span-full flex items-center gap-x-8">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                />
                <div>
                  <button
                    type="button"
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-secondary-950 shadow-sm hover:bg-white/20"
                  >
                    Change avatar
                  </button>
                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div> */}

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Name
                      </label>
                      <div className="mt-2">
                        <input
                          value={account.data?.name}
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          value={account.data?.email}
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    {/* <div className="col-span-full">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                    example.com/
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-secondary-950 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="timezone"
                className="block text-sm font-medium leading-6 text-secondary-950"
              >
                Timezone
              </label>
              <div className="mt-2">
                <select
                  id="timezone"
                  name="timezone"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                >
                  <option>Pacific Standard Time</option>
                  <option>Eastern Standard Time</option>
                  <option>Greenwich Mean Time</option>
                </select>
              </div>
            </div> */}
                  </div>

                  <div className="mt-8 flex">
                    <SubmitButton text="Speichern" />
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Passwort ändern
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Aktualisieren Sie Ihr Passwort, das mit Ihrem Konto
                    verknüpft ist.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="current-password"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Aktuelles Passwort
                      </label>
                      <div className="mt-2">
                        <input
                          id="current-password"
                          name="current_password"
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Neues Passwort
                      </label>
                      <div className="mt-2">
                        <input
                          id="new-password"
                          name="new_password"
                          type="password"
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Bestätigen Sie das Passwort
                      </label>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm_password"
                          type="password"
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <SubmitButton text="Speichern" />
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Andere Sitzungen abmelden
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Bitte geben Sie Ihr Passwort ein, um zu bestätigen, dass Sie
                    sich von von Ihren anderen Sitzungen auf allen Ihren Geräten
                    abmelden möchten.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="logout-password"
                        className="block text-sm font-medium leading-6 text-secondary-950"
                      >
                        Dein Passwort
                      </label>
                      <div className="mt-2">
                        <input
                          id="logout-password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <SubmitButton text="Abmelden" />
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Account löschen
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Du möchtest unseren Service nicht mehr nutzen? Du kannst
                    Dein Konto hier löschen. Dieser Vorgang ist nicht rückgängig
                    zu machen. Alle Informationen zu diesem diesem Konto werden
                    dauerhaft gelöscht.
                  </p>
                </div>

                <form className="flex items-start md:col-span-2">
                  <SubmitButton text="Ja, Account löschen" />
                </form>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="divide-y divide-white/5">
              <h1 className="sr-only">Einstellungen</h1>
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Einstellungen
                  </h2>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="divide-y divide-white/5">
              <h1 className="sr-only">Rechnungen</h1>
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Rechnungen
                  </h2>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="divide-y divide-white/5">
              <h1 className="sr-only">Benachrichtigungen</h1>
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-secondary-950">
                    Benachrichtigungen
                  </h2>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Page;
