"use client";
import { SubmitButton } from "@/components/FormSubmitBn";
import useAccount from "@/hooks/use-account";
import { deleteSessionsAction } from "@/server/actions/delete-sessions";
import { updateBusinessInfoAction } from "@/server/actions/update-businessinfo";
import { updatePasswordAction } from "@/server/actions/update-password";
import { updateNameAction } from "@/server/actions/update-name";
import { Tab } from "@headlessui/react";
import React, { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { deleteAccountAction } from "@/server/actions/delete-account";

const secondaryNavigation = [
  { name: "Account", href: "#", current: true },
  { name: "Einstellungen", href: "#", current: false },
  { name: "Rechungen", href: "#", current: false },
  { name: "Benachrichtigungen", href: "#", current: false },
];

const Page = () => {
  const account = useAccount();
  let userInfo = {
    name: "",
    id: "",
    email: "",
  };
  let businessInfo = {
    business: "",
    vatin: "",
    street: "",
    code: "",
    city: "",
    houseNumber: "",
  };
  const prefs = account.data?.prefs;

  if (account?.data) {
    const { name, email, $id } = account.data;
    (userInfo.name = name), (userInfo.email = email), (userInfo.id = $id);
  }

  if (prefs?.address) {
    businessInfo = JSON.parse(prefs.address);
  }
  // Update password
  const [updatePasswordState, updatePasswordFormAction] = useFormState(
    updatePasswordAction,
    {
      message: "",
    }
  );
  const updatePasswordFormRef = useRef<HTMLFormElement>(null);

  // Delete session
  const [deleteSessionsState, deleteSessionsFormAction] = useFormState(
    deleteSessionsAction,
    {
      message: "",
    }
  );
  const deleteSessionsFormRef = useRef<HTMLFormElement>(null);

  // Update BusinessInfo
  const [updateBusinessInfoState, updateBusinessInfoFormAction] = useFormState(
    updateBusinessInfoAction,
    {
      message: "",
      fieldErrors: {},
      error: "",
    }
  );
  const updateBusinessInfoFormRef = useRef<HTMLFormElement>(null);

  // Update Name
  const [updateNameState, updateNameFormAction] = useFormState(
    updateNameAction,
    {
      message: "",
    }
  );
  const updateNameFormRef = useRef<HTMLFormElement>(null);

  // Delete
  const [deleteAccountState, deleteAccountFormAction] = useFormState(
    deleteAccountAction,
    {
      message: "",
    }
  );
  const deleteAccountFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (updatePasswordState?.message === "Passwort geändert") {
      updatePasswordFormRef.current && updatePasswordFormRef.current.reset();
    }
  }, [updatePasswordState]);

  return (
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
                  Verwenden Sie eine ständige Adresse, an der Sie Post empfangen
                  können.
                </p>
              </div>

              <form
                ref={updateNameFormRef}
                className="md:col-span-2"
                action={updateNameFormAction}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-7xl sm:grid-cols-6">
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
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        defaultValue={userInfo.name}
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {Boolean(updateNameState?.error) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗ {updateNameState?.error}
                      </div>
                    )}
                    {Boolean(updateNameState?.message) && (
                      <div className="text-sm text-green-500 text-right">
                        ✓ {updateNameState?.message}
                      </div>
                    )}
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
                        disabled
                        id="email"
                        defaultValue={userInfo.email}
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
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
                <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
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
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 [&_*]:text-black"
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
            {/* Change business information */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-secondary-950">
                  Persönliche Informationen
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Verwenden Sie eine ständige Adresse, an der Sie Post empfangen
                  können.
                </p>
              </div>

              <form
                ref={updateBusinessInfoFormRef}
                className="md:col-span-2"
                action={updateBusinessInfoFormAction}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-7xl sm:grid-cols-6">
                  {/* business */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="business"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      Geschäftsname
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        defaultValue={businessInfo.business}
                        name="business"
                        id="business"
                        autoComplete="businessname"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {Boolean(
                      updateBusinessInfoState.fieldErrors["business"]
                    ) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗{" "}
                        {
                          updateBusinessInfoState.fieldErrors["business"]
                            .message
                        }
                      </div>
                    )}
                  </div>
                  {/* vatin */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="vatin"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      VAT Nummer
                    </label>
                    <div className="mt-2">
                      <input
                        id="vatin"
                        defaultValue={businessInfo.vatin}
                        name="vatin"
                        type="text"
                        autoComplete="vatin"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {Boolean(updateBusinessInfoState.fieldErrors["vatin"]) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗ {updateBusinessInfoState.fieldErrors["vatin"].message}
                      </div>
                    )}
                  </div>
                  {/*street  */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      Straße
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
                        <input
                          type="text"
                          name="street"
                          defaultValue={businessInfo.street}
                          id="street"
                          autoComplete="street"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {Boolean(updateBusinessInfoState.fieldErrors["street"]) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗{" "}
                        {updateBusinessInfoState.fieldErrors["street"].message}
                      </div>
                    )}
                  </div>
                  {/*house number  */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="houseNumber"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      Hausnummer
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
                        <input
                          type="text"
                          defaultValue={businessInfo.houseNumber}
                          name="houseNumber"
                          id="houseNumber"
                          autoComplete="houseNumber"
                          className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-secondary-950 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {Boolean(
                      updateBusinessInfoState.fieldErrors["houseNumber"]
                    ) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗{" "}
                        {
                          updateBusinessInfoState.fieldErrors["houseNumber"]
                            .message
                        }
                      </div>
                    )}
                  </div>
                  {/*code  */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      Postleitzahl
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
                        {/* <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm"></span> */}
                        <input
                          type="text"
                          defaultValue={businessInfo.code}
                          name="code"
                          id="code"
                          autoComplete="code"
                          className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-secondary-950 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {Boolean(updateBusinessInfoState.fieldErrors["code"]) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗ {updateBusinessInfoState.fieldErrors["code"].message}
                      </div>
                    )}
                  </div>
                  {/*city  */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-secondary-950"
                    >
                      Stadt
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
                        {/* <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm"></span> */}
                        <input
                          type="text"
                          name="city"
                          defaultValue={businessInfo.city}
                          id="city"
                          autoComplete="city"
                          className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-secondary-950 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {Boolean(updateBusinessInfoState.fieldErrors["city"]) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗ {updateBusinessInfoState.fieldErrors["city"].message}
                      </div>
                    )}
                  </div>
                </div>

                {Boolean(updateBusinessInfoState?.error) && (
                  <div className="text-sm text-red-500 text-right">
                    ✗ {updateBusinessInfoState?.error}
                  </div>
                )}
                {Boolean(updateBusinessInfoState?.message) && (
                  <div className="text-sm text-green-500 text-right">
                    ✓ {updateBusinessInfoState?.message}
                  </div>
                )}
                <div className="mt-8 flex">
                  <SubmitButton text="Speichern" />
                </div>
              </form>
            </div>
            {/* Change password */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-secondary-950">
                  Passwort ändern
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Aktualisieren Sie Ihr Passwort, das mit Ihrem Konto verknüpft
                  ist.
                </p>
              </div>

              <form
                className="md:col-span-2"
                ref={updatePasswordFormRef}
                action={updatePasswordFormAction}
              >
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
                        name="oldPassword"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
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
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {Boolean(updatePasswordState?.error) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗ {updatePasswordState?.error}
                      </div>
                    )}
                    {Boolean(updatePasswordState?.message) && (
                      <div className="text-sm text-green-500 text-right">
                        ✓ {updatePasswordState?.message}
                      </div>
                    )}
                  </div>

                  {/* <div className="col-span-full">
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
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div> */}
                </div>

                <div className="mt-8 flex">
                  <SubmitButton text="Speichern" />
                </div>
              </form>
            </div>
            {/* Logout from all sessions */}
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

              <form
                className="md:col-span-2"
                action={deleteSessionsFormAction}
                ref={deleteSessionsFormRef}
              >
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
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-secondary-950 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {Boolean(deleteSessionsState?.error) && (
                      <div className="text-sm text-red-500 text-right">
                        ✗ {deleteSessionsState?.error}
                      </div>
                    )}
                    {Boolean(deleteSessionsState?.message) && (
                      <div className="text-sm text-green-500 text-right">
                        ✓ {deleteSessionsState?.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex">
                  <SubmitButton text="Abmelden" />
                </div>
              </form>
            </div>
            {/* Delete account */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-secondary-950">
                  Account löschen
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Du möchtest unseren Service nicht mehr nutzen? Du kannst Dein
                  Konto hier löschen. Dieser Vorgang ist nicht rückgängig zu
                  machen. Alle Informationen zu diesem diesem Konto werden
                  dauerhaft gelöscht. Dein Abo wird zum nächstmöglichen
                  Zeitpunkt beendet.
                </p>
              </div>

              <form
                ref={deleteAccountFormRef}
                className="flex items-start md:col-span-2"
                action={deleteAccountFormAction}
              >
                <input
                  type="text"
                  name="id"
                  hidden
                  defaultValue={userInfo.id}
                />
                {Boolean(deleteAccountState?.error) && (
                  <div className="text-sm text-red-500 text-right">
                    ✗ {deleteAccountState?.error}
                  </div>
                )}
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
                  Einstellungen - coming soon
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
                <p>
                  Wir schicken dir die deine Rechnung zum Monatsanfang zu.
                </p>
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
                  Benachrichtigungen - coming soon
                </h2>
              </div>
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Page;
