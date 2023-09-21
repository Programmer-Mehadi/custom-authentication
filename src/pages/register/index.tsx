import { serverApi } from "@/utils/server/server";
import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
  });

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
      name: data.name !== "" ? false : true,
      email: data.email !== "" ? false : true,
      password: data.password !== "" ? false : true,
    });
    if (data.name !== "" && data.email !== "" && data.password !== "") {
      try {
        const res = await fetch(serverApi + "/api/v1/user", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();

        if (resData.success) {
          setData({
            name: "",
            email: "",
            password: "",
          });
          toast.success(resData.message);
          router.push("/login");
        } else {
          toast.error(resData.message);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center py-10 px-5">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-[400px] border border-green-100">
          {isLogin ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">User Registration</h2>
              <form onSubmit={handleSubmitForm}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input w-full mt-2 border border-slate-300 py-1 px-2 rounded"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                  {error.name && (
                    <span className="text-red-500 text-xs">
                      This field is required*
                    </span>
                  )}
                </div>
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
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
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
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                  {error.password && (
                    <span className="text-red-500 text-xs">
                      This field is required*
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white mt-3 py-2 px-4 rounded hover:bg-green-600"
                >
                  Register
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
