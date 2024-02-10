import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {

  return (
    <header className="bg-[#ffffffb9] border-b-2 border-b-slate-300 absolute top-0 w-screen flex h-16 items-center justify-between px-10">
      <Link href="/dashboard" className="font-extrabold text-2xl">
        NOTE<span className="text-blue-600">AI</span>
      </Link>
      <UserButton />
    </header>
  );
}
