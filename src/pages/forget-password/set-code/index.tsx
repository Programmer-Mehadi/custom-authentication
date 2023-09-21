import { serverApi } from "@/utils/server/server";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SetCodePage = () => {
  const [checkValidate, setCheckValidate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  async function checkToken() {
    const res = await fetch(
      `${serverApi}/api/v1/auth/forget-password/check-token`,
      {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (data.success) {
      setCheckValidate(true);
      setLoading(false);
      return true;
    } else {
      setCheckValidate(false);
      setLoading(false);
      return false;
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (token) {
        const status = await checkToken();
        if (status) {
          setCheckValidate(true);
        }
      } else {
        setLoading(false);
        setCheckValidate(false);
      }
    }
    fetchData();
  }, [token]);

  async function handleSubmitCode(e: any) {
    e.preventDefault();
    if (code === "") {
      setError(true);
      return;
    }
    const res = await fetch(
      `${serverApi}/api/v1/auth/forget-password/check-code`,
      {
        method: "POST",
        body: JSON.stringify({ code, token }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (!data.success) {
      setError(false);
      toast.error(data.message);
    } else {
      router.push(
        `/forget-password/set-password?token=${token}&setPasswordToken=${data.passwordToken}`
      );
    }
  }

  return (
    <>
      <Head>
        <title>Set Code</title>
      </Head>
      <section>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {checkValidate ? (
              <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-5">
                <div className="bg-white p-6 rounded shadow-md w-full md:w-1/2 lg:w-1/3">
                  <h1 className="text-2xl font-semibold mb-4">Set Code</h1>
                  <form onSubmit={handleSubmitCode}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="code"
                      >
                        Verification Code
                      </label>
                      <input
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        type="text"
                        id="code"
                        name="code"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                      {error && (
                        <span className="text-red-500 text-xs">
                          This field is required*
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
                        type="submit"
                      >
                        Set Code
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

export default SetCodePage;
