import { Transition } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { address, chainId } from "@store/slices/accountSlice";
import web3 from "./../ethereum/web3";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

const Identicon = require("identicon.js");

const Layout: FC = (props) => {
  const [showUserDropdown, setshowUserDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const accountState = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const signIn = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      dispatch(address(null));
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== accountState.address) {
      dispatch(address(accounts[0]));
      // Do any other work!
    }
  };

  const handleChainChanged = (_chainId: string) => {
    // We recommend reloading the page, unless you must do otherwise
    if (accountState.chainId !== _chainId) {
      window.location.reload();
      // Run any other necessary logic...
    }
  };

  useEffect(() => {
    web3.eth.getAccounts().then(handleAccountsChanged);
    window.ethereum
      .request({ method: "eth_chainId" })
      .then((chain: string) => dispatch(chainId(chain)))
      .catch((err: ErrorEvent) => console.error(err));

    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  });

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex px-2 lg:px-0">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" passHref>
                  <a>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
                      alt="Workflow"
                    />
                  </a>
                </Link>
              </div>
              <nav
                aria-label="Global"
                className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4"
              >
                <Link href="/">
                  <a className="px-3 py-2 text-gray-900 text-sm font-medium">
                    Campaigns
                  </a>
                </Link>

                <Link href="/campaigns/new" passHref>
                  <button
                    type="button"
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Link>
              </nav>
            </div>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setShowMenu(true)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {showMenu && (
              <div className="lg:hidden">
                <div
                  className="z-20 fixed inset-0 bg-black bg-opacity-25"
                  aria-hidden="true"
                ></div>

                <div className="z-30 absolute top-0 right-0 max-w-none w-full p-2 transition transform origin-top">
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
                    <div className="pt-3 pb-2">
                      <div className="flex items-center justify-between px-4">
                        <div>
                          <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
                            alt="Workflow"
                          />
                        </div>
                        <div className="-mr-2">
                          <button
                            onClick={() => setShowMenu(false)}
                            type="button"
                            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                          >
                            <span className="sr-only">Close menu</span>
                            <svg
                              className="h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 px-2 space-y-1">
                        <Link href="/">
                          <a className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                            Campaigns
                          </a>
                        </Link>
                      </div>
                      <div className="mt-3 px-2 space-y-1">
                        <Link href="/campaigns/new">
                          <a
                            onClick={() => setShowMenu(false)}
                            className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                          >
                            Create Campaign
                          </a>
                        </Link>
                      </div>
                    </div>
                    <div className="pt-4 pb-2">
                      {accountState.address && (
                        <div>
                          <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                              <img
                                className="h-8 w-8 rounded-full"
                                src={`data:image/png;base64,${new Identicon(
                                  accountState.address,
                                  30
                                ).toString()}`}
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-base font-medium text-gray-800">
                                {accountState.address.substring(0, 15)}...
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <span className="sr-only">
                                View notifications
                              </span>
                              <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-3 px-2 space-y-1">
                            <Link href="/">
                              <a className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                                Your Campaigns
                              </a>
                            </Link>
                          </div>
                        </div>
                      )}
                      {!accountState.address && (
                        <div>
                          <div className="flex items-center px-5">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Sign In
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!accountState.address && (
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                <button
                  onClick={signIn}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign In
                </button>
              </div>
            )}
            {accountState.address && (
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                <button
                  type="button"
                  className="flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="ml-4 relative flex-shrink-0">
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setshowUserDropdown(!showUserDropdown);
                      }}
                      type="button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`data:image/png;base64,${new Identicon(
                          accountState.address,
                          30
                        ).toString()}`}
                        alt=""
                      />
                    </button>
                  </div>

                  <Transition
                    show={showUserDropdown}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        id="user-menu-item-0"
                      >
                        Your Campaigns
                      </a>
                    </div>
                  </Transition>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="py-4">{props.children}</main>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Layout;
