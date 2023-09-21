import { serverApi } from "@/utils/server/server";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isLogin, setIsLogin] = React.useState(false);
  const route = useRouter();
  useEffect(() => {
    console.log("route");
    const token = localStorage.getItem("custom-authentication-auth-token");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [route]);
  async function handleLogout() {
    const token = localStorage.getItem("custom-authentication-auth-token");
    const response = await fetch(`${serverApi}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await response.json();
    if (resData.success) {
      toast.success(resData.message);
      setIsLogin(false);
      localStorage.removeItem("custom-authentication-auth-token");
      route.push("/login");
    }
  }
  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex flex-wrap gap-5 justify-between items-center">
          <div className="text-white font-semibold text-xl">
            Custom Authentication
          </div>
          <ul className="flex space-x-4">
            {isLogin ? (
              <li>
                <Link href="/user" className="text-white hover:text-blue-300">
                  User
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-white hover:text-blue-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-white hover:text-blue-300"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                href="/forget-password/get-email"
                className="text-white hover:text-blue-300"
              >
                Forget Password
              </Link>
            </li>
            {isLogin && (
              <li>
                <p
                  className="text-white bg-red-700 py-1 px-2 rounded cursor-pointer"
                  onClick={() => handleLogout()}
                >
                  Logout
                </p>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
