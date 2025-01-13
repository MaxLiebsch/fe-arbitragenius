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
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { logoutAction } from "@/server/actions/logout";
import { Logo } from "../Logo";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { TotalDealsContext } from "@/context/totalDealsContext";
import useSalesCount from "@/hooks/use-sales-count";
import { Badge } from "antd";
import useAccount from "@/hooks/use-account";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import useAppereanceAdd from "@/hooks/use-appereance-add";
import { Mode } from "@/types/Appearance";
import { useThemeAtom } from "@/hooks/use-theme";
import ReleaseModal from "../ReleaseModal";

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
    name: "Meine Deals",
    href: "/dashboard/my-deals",
    icon: BookmarkIcon,
    current: false,
  },
  {
    name: "Amazon Flips (Beta)",
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
  const eSalesCount = useSalesCount("e");
  const aSalesCount = useSalesCount("a");
  const newDeals = Boolean(
    eSalesCount.data?.totalProductsToday || aSalesCount.data?.totalProductsToday
  );
  const pathname = usePathname();

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
            className="relative z-50 lg:hidden"
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
                    <div className="flex h-16 shrink-0 items-center">
                      <Logo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
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
                        {/* <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Deine Favoriten{" "}
                            {favoriteShopsQuery.isLoading && (
                              <div className="w-full flex justify-center">
                                <Spinner />
                              </div>
                            )}
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {favoriteShopsQuery.data?.map((shop) => (
                              <li key={shop.ne}>
                                <Link
                                  href={`/dashboard/shop/${shop.d}`}
                                  className={classNames(
                                    pathname.includes(shop.d)
                                      ? "bg-gray-light text-secondary"
                                      : "text-gray-dark hover:text-secondary hover:bg-gray-light",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      // team.current
                                      //   ? "text-secondary border-secondary-900" :
                                      "text-gray-400 border-border-gray group-hover:border-secondary-900 group-hover:text-secondary",
                                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                                    )}
                                  >
                                    {shop.d.substring(0, 2).toLocaleUpperCase()}
                                  </span>
                                  <span className="truncate">{shop.ne}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li> */}
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
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border-gray bg-default  px-6">
            <div className="mt-5">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Badge.Ribbon
                          text="Neue Deals"
                          placement="end"
                          className={`!-top-2 ${
                            item.href !== "/dashboard/daily-deals"
                              ? "hidden"
                              : ""
                          } ${
                            item.href === "/dashboard/daily-deals" && newDeals
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <Link
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
                        </Badge.Ribbon>
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
          <div className="lg:pl-80 fixed top-0 z-40 lg:mx-auto lg:px-8 w-full">
            <div className="flex h-16 items-center gap-x-4 border-b border-border-gray bg-default px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-dark lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="w-full">
                  <ReleaseModal/>
                  {subscriptionStatus.status === "trialing" ? (
                    <div className="mt-5">
                      Danke, dass Du dich für Arbispotter entschieden hast. Du
                      befindest Dich noch{" "}
                      <span className="font-semibold">
                        {formatDistanceToNow(
                          Number(subscriptionStatus.trialEnd as string) * 1000,
                          { locale: de }
                        )}{" "}
                      </span>
                      in der Testphase.
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {/* <form className="relative flex flex-1" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-dark placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                    name="search"
                  />
                </form> */}
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
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
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-dark"
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
          <div className="lg:pl-80 pt-20 pb-4 px-4 sm:px-6 lg:px-8 h-full relative">
            {children}
          </div>
        </main>
      </div>
    </TotalDealsContext.Provider>
  );
};
