'use client'
import Header from "@/components/Header";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {useSession} from '@clerk/nextjs'

export default function Home() {
  const {isSignedIn} = useSession()

  return (
    <>
    <Header />
    <main className="flex justify-center h-screen w-screen">
      <div className="mt-72 flex flex-col items-center gap-2 text-center w-1/2">
        <h1 className="text-6xl font-extrabold">
          NOTE<span className="text-blue-600">AI</span>
        </h1>
        <p className="text-xl">AI powered note taking tool for your daily life.</p>
        <Link href={isSignedIn ? "/dashboard" : "/sign-in"} className='mt-2 bg-primary text-white flex rounded-2xl py-3 px-4'>
          Get Started <ArrowRightIcon width={27} height={27} className="ml-2"/>
        </Link>
      </div>
    </main>
    </>
  );
}
