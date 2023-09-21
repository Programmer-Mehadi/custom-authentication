import { serverApi } from "@/utils/server/server";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("custom-authentication-auth-token");

    if (authToken) {
      router.push("/user");
    } else {
      setIsLogin(false);
    }
  }, [router]);
  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    setError({
      email: data.email !== "" ? false : true,
      password: data.password !== "" ? false : true,
    });
    if (data.email !== "" && data.password !== "") {
      const res = await fetch(serverApi + "/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      if (resData.success) {
        if (resData.token) {
          localStorage.setItem(
            "custom-authentication-auth-token",
            resData.token
          );
          toast.success(resData.message);
          router.push("/user");
        }
      } else {
        toast.error(resData.message);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center py-10 px-5">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-[400px] border border-blue-100">
          {isLogin ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">User Login</h2>
              <form onSubmit={handleSubmitForm}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input w-full mt-2 border border-slate-300 py-1 px-2 rounded"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    value={data.email}
                  />
                  {error.email && (
                    <span className="text-red-500 text-xs">
                      This field is required*
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    className="form-input w-full mt-2 border border-slate-300 py-1 px-2 rounded"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    value={data.password}
                  />
                  {error.password && (
                    <span className="text-red-500 text-xs">
                      This field is required*
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white mt-3 py-2 px-4 rounded hover:bg-blue-600"
                >
                  Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
