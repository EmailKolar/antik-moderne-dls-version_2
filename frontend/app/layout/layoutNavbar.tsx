import { SignedIn, SignedOut, UserButton } from "@clerk/react-router";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { FaCartShopping } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

import { ThemeChanger } from "~/components/ThemeChanger";
import useUserRole from "~/hooks/useUserRole";
import Cart from "~/components/Cart/Cart";
import { useAtomValue } from "jotai";
import { cartAtom } from "~/atoms/cartAtom";
import useCart from "~/hooks/useCart";

export default function layoutNavbar() {
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const { userRole } = useUserRole();
  const cart = useAtomValue(cartAtom);
  useCart();

  useEffect(() => {
    setTheme("light");
  }, []);

  const navLinkClassName = (linkPath: string) =>
    `${
      pathname === linkPath
        ? `border-black border-b ${theme == undefined || theme == "light" ? "border-neutral-950" : "border-neutral-50"}`
        : ""
    }`;

  return (
    <div className="min-h-screen text-center flex flex-col">
      <nav className="flex items-center justify-center">
        <div className="w-[95%] p-4 px-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <NavLink to="/">
              <img
                className="border border-black grayscale rounded-full"
                src="/logo.png"
                width={50}
                alt="ANTIK MODERNE"
              />
            </NavLink>
            <ThemeChanger />
          </div>
          <div className="flex space-x-4 items-center">
            <NavLink to="/" className={navLinkClassName("/")}>
              Home
            </NavLink>
            <NavLink to="/posters" className={navLinkClassName("/posters")}>
              Posters
            </NavLink>
            <NavLink to="/about" className={navLinkClassName("/about")}>
              About
            </NavLink>

            <SignedOut>
              <NavLink to="/sign-in" className={navLinkClassName("/sign-in")}>
                Sign in
              </NavLink>
            </SignedOut>
            <SignedIn>
              {userRole === "ADMIN" && (
                <NavLink to="/admin" className={navLinkClassName("/admin")}>
                  Admin
                </NavLink>
              )}

              <UserButton />
            </SignedIn>
            <Popover>
              <PopoverTrigger
                asChild
                className="relative hover:cursor-pointer hover:bg-gray-200 p-1.5 rounded-full data-[state=open]:bg-gray-200"
              >
                <div>
                  <FaCartShopping size={20} className="text-2xl" />
                  <div className="absolute top-0 -right-1 z-50 bg-red-500 text-white rounded-full w-3.5 h-3.5 flex justify-center items-center">
                    <span className="text-xs">{cart && cart.basketItems.length}</span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-72 max-h-80 overflow-y-auto">
                <Cart />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
      <div className={"flex-1"}>
        <Outlet />
      </div>
      <div>
        <footer className="flex flex-col items-center p-4 mt-6">
          <img className="border border-black grayscale rounded-full" src="/logo.png" width={50} alt="ANTIK MODERNE" />
          <p className="italic mt-3">© 2025 ANTIK MODERNE</p>
        </footer>
      </div>
    </div>
  );
}
