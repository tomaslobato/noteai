import Editor from "@/components/Editor";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: {
    noteId: string;
  };
};

export default async function NotePage({ params: { noteId } }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }
  const user = await clerk.users.getUser(userId);
  //finding the note by it's id and the user id
  const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

  if (notes.length != 1) {
    return redirect("/dashboard");
  }

  const note = notes[0];

  return (
    <main>
      <header className="bg-[#ffffffb9] border-b-2 border-b-slate-300 w-screen flex h-16 items-center justify-between px-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="font-extrabold text-2xl">
            NOTE<span className="text-blue-600">AI</span>
          </Link>
          <span className="bg-slate-300 px-2 rounded-3xl">
            {user.firstName} {user.lastName} / {note.name}
          </span>
        </div>
      </header>

      <div className="border-slate-300 shadow-xl border rounded-lg px-16 w-full pt-4">
        <Editor note={note}/>
      </div>
    </main>
  );
}
