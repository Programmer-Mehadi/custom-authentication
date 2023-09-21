import { serverApi } from "@/utils/server/server";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const SetPasswordPage = () => {
  const router = useRouter();
  const { token, setPasswordToken } = router.query;

  const [validate, setValidate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    password: false,
    confirmPassword: false,
    notMatch: true,
  });
  useEffect(() => {
    if (token === undefined || setPasswordToken === undefined) {
      setLoading(false);
      setValidate(false);
      return;
    }
    async function checkToken() {
      const res = await fetch(
        `${serverApi}/api/v1/auth/forget-password/check-token-password-token`,
        {
          method: "POST",
          body: JSON.stringify({ token, setPasswordToken }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setValidate(true);
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        setValidate(false);
        return false;
      }
    }

    checkToken();
  }, [token, setPasswordToken]);
  // handleFormSubmit
  async function handleFormSubmit(e: any) {
    e.preventDefault();
    setError({
      password: data.password !== "" ? false : true,
      confirmPassword: data.confirmPassword !== "" ? false : true,
      notMatch: data.password === data.confirmPassword ? true : false,
    });
    if (
      data.password !== "" &&
      data.confirmPassword !== "" &&
      data.password === data.confirmPassword
    ) {
      const res = await fetch(
        serverApi + "/api/v1/auth/forget-password/set-new-password",
        {
          method: "POST",
          body: JSON.stringify({
            token: token,
            setPasswordToken: setPasswordToken,
            password: data.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      if (resData.success) {
        router.push("/login");
        toast.success(resData.message);
      } else {
        toast.error(resData.message);
      }
    }
  }
  return (
    <>
      <Head>
        <title>Set Password</title>
      </Head>
      <section>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {validate ? (
              <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-5">
                <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2 lg:w-1/3">
                  <h1 className="text-2xl font-semibold mb-4">
                    Set New Password
                  </h1>
                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                      >
                        New Password
                      </label>
                      <input
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Enter new password"
                        onChange={(e) => {
                          setData({ ...data, password: e.target.value });
                        }}
                        value={data.password}
                      />
                      {error.password && (
                        <p className="text-red-500 text-xs italic">
                          This field is required
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </label>
                      <input
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        type="text"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        onChange={(e) => {
                          setData({ ...data, confirmPassword: e.target.value });
                        }}
                        value={data.confirmPassword}
                      />
                      {error.confirmPassword && (
                        <p className="text-red-500 text-xs italic">
                          This field is required
                        </p>
                      )}
                      {!error.notMatch && (
                        <p className="text-red-500 text-xs italic">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                        type="submit"
                      >
                        Set Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="min-h-screen bg-gray-50 py-10 px-5 flex items-center justify-center">
                <div className="bg-white shadow-sm border p-4 rounded-md px-8">
                  <p className="text-red-700 font-bold text-xl">
                    Expired Token
                  </p>
                  <p className="text-red-500 text-lg mt-3">
                    Your session has expired. Please send a new request again to
                    continue. <br />
                    <Link
                      href="/forget-password/get-email"
                      className="text-blue-600 underline"
                    >
                      Forget Password
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default SetPasswordPage;
