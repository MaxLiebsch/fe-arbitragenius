"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  BookmarkIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowsUpDownIcon,
  TagIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { logoutAction } from "@/server/actions/logout";
import { Logo } from "../Logo";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { TotalDealsContext } from "@/context/totalDealsContext";
import useAccount from "@/hooks/use-account";
import useAppereanceAdd from "@/hooks/use-appereance-add";
import { Mode } from "@/types/Appearance";
import { useThemeAtom } from "@/hooks/use-theme";
import ReleaseModal from "../ReleaseModal";
import ProductFilterPopover from "../ProductFilterPopover";
import DealStatistics from "../DealStatistics";
import SearchForm from "../forms/SearchForm";

export const DashboardLayout = ({
  children,
  subscriptionStatus,
}: Readonly<{
  children: React.ReactNode;
  subscriptionStatus: {
    status: string | null;
    trialEnd: string | null;
    trialStart: string | null;
  };
}>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  const accountQuery = useAccount();
  const pathname = usePathname();
  const productView = [
    "amazon-flips",
    "shop",
    "daily-deals",
    "deal-hub",
    "search",
  ].some((keywords) => pathname.includes(keywords));

  const [state, formAction] = useFormState(logoutAction, {
    message: "",
  });
  const [queryUpdate, setQueryUpdate] = useState(0);
  const [{ mode }, setApperance] = useThemeAtom();
  const [isClient, setIsClient] = useState(false);
  const mutateAppearance = useAppereanceAdd();
  useEffect(() => {
    if (state.message === "success") {
      router.push("/auth/signin");
    }
    setIsClient(true);
  }, [state, router]);

  if (!isClient) {
    return null;
  }

  return (
    <TotalDealsContext.Provider value={{ queryUpdate, setQueryUpdate }}>
      <div className="h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative block z-50 min-2xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-default px-6 pb-2 pt-5">
                    <div className="">
                      <Logo />
                    </div>
                    <nav className="flex flex-col gap-2">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7 lg:hidden">
                        <li>
                          <ul role="list" className="-mx-2 space-y-2">
                            <li>
                              <DealStatistics />
                            </li>
                            <li>
                              <SearchForm />
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => {
                                    setSidebarOpen(false);
                                  }}
                                  className={classNames(
                                    pathname === item.href
                                      ? "bg-gray-light text-secondary"
                                      : "text-gray-dark hover:text-secondary hover:bg-gray-light",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      pathname === item.href
                                        ? "text-secondary"
                                        : "text-gray-400 group-hover:text-secondary",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />

                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                    <div className="absolute left-[0.25rem] bottom-0">
                      v{process.env.NEXT_PUBLIC_VERSION}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}

        <div className="hidden min-2xl:fixed min-2xl:inset-y-0 min-2xl:z-50 min-2xl:flex min-2xl:w-72 min-2xl:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border-gray bg-default  px-6">
            <div className="mt-5 w-full">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          onClick={() => {
                            setSidebarOpen(false);
                          }}
                          href={item.href}
                          className={classNames(
                            item.href === pathname
                              ? "bg-gray-light text-secondary"
                              : "text-gray-dark hover:text-secondary hover:bg-gray-light",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.href === pathname
                                ? "text-secondary"
                                : "text-gray-400 group-hover:text-secondary",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
            <div className="absolute left-[0.25rem] bottom-0">
              v{process.env.NEXT_PUBLIC_VERSION}
            </div>
          </div>
        </div>

        <main className="h-full" suppressHydrationWarning>
          <div className="sm:pl-4 min-2xl:pl-80 fixed top-0 z-40 min-2xl:mx-auto min-2xl:px-8 w-full">
            <div className="flex h-16 items-center gap-x-4 border-b border-border-gray bg-default px-4 shadow-sm sm:gap-x-6 sm:px-6 min-2xl:px-0 min-2xl:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-dark sm:block min-2xl:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 sm:block min-2xl:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch items-center min-2xl:gap-x-6">
                <ReleaseModal />
                <div className="hidden lg:block">   
                  <DealStatistics />
                </div>
                <div className="hidden lg:block">
                  <SearchForm />
                </div>
                <div className="flex items-center gap-x-4 min-2xl:gap-x-6 ml-auto">
                  {/* Separator */}
                  <div
                    className="sm:hidden min-2xl:block min-2xl:h-6 min-2xl:w-px min-2xl:bg-gray-200"
                    aria-hidden="true"
                  />

                  {/* Apperance dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <Cog6ToothIcon className="h-6 w-6" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="dark:bg-black absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-default py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {appearanceItems["mode"].map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  mutateAppearance.mutate({
                                    mode: item.mode as Mode,
                                  });
                                }}
                                className={classNames(
                                  "w-full",
                                  mode === item.mode ? "bg-gray-light" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-dark"
                                )}
                              >
                                {item.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      <span className="sm:hidden min-2xl:flex min-2xl:items-center">
                        <span
                          className="hidden min-2xl:block ml-4 text-sm font-semibold leading-6 text-gray-dark"
                          aria-hidden="true"
                        >
                          {accountQuery.isSuccess ? (
                            accountQuery.data.name
                          ) : (
                            <></>
                          )}
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="dark:bg-black absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-default py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                onClick={() => {
                                  setSidebarOpen(false);
                                }}
                                href={item.href ? item.href : ""}
                                className={classNames(
                                  active ? "bg-gray-light" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-dark"
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <Menu.Item key={"logout"}>
                          <form action={formAction}>
                            <input hidden></input>
                            <button
                              type="submit"
                              className={classNames(
                                "focus:bg-gray-light",
                                "block px-3 py-1 text-sm leading-6 text-gray-dark"
                              )}
                            >
                              Logout
                            </button>
                          </form>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
          <div className="min-2xl:pl-80 pt-20 pb-4 px-4 sm:px-6 min-2xl:px-8 h-full relative">
            {productView ? <ProductFilterPopover /> : <></>}
            {children}
          </div>
        </main>
      </div>
    </TotalDealsContext.Provider>
  );
};

const navigation = [
  {
    name: "Shops Übersicht",
    href: "/dashboard",
    icon: HomeIcon,
    current: true,
  },
  {
    name: "Sales Monitor",
    href: "/dashboard/daily-deals",
    current: false,
    icon: SparklesIcon,
  },
  {
    name: "Deal Hub",
    href: "/dashboard/deal-hub",
    current: false,
    icon: TagIcon,
  },
  {
    name: "Meine Deals",
    href: "/dashboard/my-deals",
    icon: BookmarkIcon,
    current: false,
  },
  {
    name: "Amazon Flips",
    icon: ArrowsUpDownIcon,
    href: "/dashboard/amazon-flips",
    current: false,
  },
  {
    name: "Wholesale Analyse",
    href: "/dashboard/wholesale",
    icon: ArrowTrendingUpIcon,
    current: false,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: UsersIcon,
    current: false,
  },
];

const userNavigation = [{ name: "Dein Profil", href: "/dashboard/profile" }];

const appearanceItems = {
  mode: [
    {
      mode: "light",
      name: "Hell",
    },
    {
      mode: "dark",
      name: "Dunkel",
    },
    {
      mode: "system",
      name: "System",
    },
  ],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
