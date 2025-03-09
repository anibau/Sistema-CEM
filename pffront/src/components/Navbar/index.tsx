"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import userDataStorage from "@/storage/userStore";
import orderDataStorage from "@/storage/orderStore";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const { userData, clearUserData } = userDataStorage();
  const { clearOrderData } = orderDataStorage();

  const handleLogout = () => {
    clearUserData();
    clearOrderData();
    router.push("/");
  };


  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 z-50 w-full bg-transparent shadow-md backdrop-blur transition-all duration-300"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-[5vw]">
        <Link href="/" className="display3 text-primary-500">
          MobileCer
        </Link>
        <div>
          {pathname === "/" ? (
            userData ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center px-8 py-[8px] rounded-[16px] bg-primary-500 text-title3 text-white lg:px-12 lg:py-[10px]"
              >
                Ir al Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center justify-center px-8 py-[8px] rounded-[16px] bg-primary-500 text-title3 text-white lg:px-12 lg:py-[10px]"
              >
                Login
              </button>
            )
          ) : pathname.includes("/dashboard") ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-8 py-[8px] rounded-[16px] bg-primary-500 text-title3 text-white lg:px-12 lg:py-[10px]"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center px-8 py-[8px] rounded-[16px] bg-primary-500 text-title3 text-white lg:px-12 lg:py-[10px]"
            >
              Home
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
