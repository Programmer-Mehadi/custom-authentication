import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Shared/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <main>
        <div
          className={`flex min-h-screen flex-row justify-center gap-8 flex-wrap items-center  p-24 bg-gray-100 ${inter.className}`}
        >
          <button className="bg-blue-600 py-1 px-5 rounded font-bold text-white">
            <Link href={"/login"}>Login</Link>
          </button>
          <button className="bg-green-600 py-1 px-5 rounded font-bold text-white">
            <Link href={"/register"}>Register</Link>
          </button>
          <button className="bg-slate-600 py-1 px-5 rounded font-bold text-white">
            <Link href={"/forget-password/get-email"}>Forget Password</Link>
          </button>
        </div>
      </main>
    </>
  );
}
