import { serverApi } from "@/utils/server/server";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const GetEmailPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    setError(false);
    if (email !== "") {
      const res = await fetch(
        `${serverApi}/api/v1/auth/forget-password/get-email`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();

      if (resData.success) {
        toast.success(resData.message);
        setEmail("");
        setError(false);
      } else {
        toast.error(resData.message);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Get Email</title>
      </Head>
      <section>
        <div className="bg-gray-100">
          <div className="min-h-screen flex items-center justify-center py-10 px-5">
            <div className="bg-white p-8 rounded shadow-md w-96">
              <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
              <p className="text-gray-600 mb-4">
                Enter your email address, and we will send you a password reset
                link.
              </p>
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
                    className="form-input w-full mt-2 border border-blue-200 px-2 py-1 rounded"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                  Send Reset Link
                </button>
              </form>
              <p className="text-center mt-4 text-gray-500 text-sm">
                <Link href="/" className="hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetEmailPage;
