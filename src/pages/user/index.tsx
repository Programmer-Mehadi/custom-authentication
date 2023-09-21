import { serverApi } from "@/utils/server/server";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserTablePage = () => {
  const router = useRouter();
  const [data, setdata] = useState([]);
  const [refetch, setrefetch] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const fetchdata = async () => {
    const res = await fetch(serverApi + "/api/v1/user");
    const data = await res.json();
    setdata(data.data);
  };

  const checkTokenValidate = async () => {
    const authToken = localStorage.getItem("custom-authentication-auth-token");
    if (authToken === null) {
      router.push("/login");
    }
    const res = await fetch(serverApi + "/api/v1/auth/check-login", {
      method: "POST",
      body: JSON.stringify({ token: authToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success) {
      setIsLogin(true);
      fetchdata();
    } else {
      localStorage.removeItem("custom-authentication-auth-token");
      router.push("/login");
    }
  };
  useEffect(() => {
    checkTokenValidate();
  }, [refetch, router]);
  const deleteuser = async (id: string) => {
    const res = await fetch(serverApi + "/api/v1/user?id=" + id, {
      method: "DELETE",
    });
    const resData = await res.json();
    if (resData.success && resData.data.deletedCount > 0) {
      toast.success(resData.message);
      setrefetch(!refetch);
    }
  };

  return (
    <>
      <Head>
        <title>User List</title>
      </Head>
      <div>
        <div className="bg-gray-100 min-h-screen py-10 px-5">
          <div className="container mx-auto p-6">
            {isLogin ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">Table List</h2>
                <div className="overflow-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Password
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data ? (
                        data?.map((user: any, index: number) => {
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                {user.password}
                              </td>
                              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  Edit
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 ml-2"
                                  onClick={() => deleteuser(user._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Loading...
              </h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTablePage;
