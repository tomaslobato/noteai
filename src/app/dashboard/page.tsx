import Header from "@/components/Header";
import NewNoteDialog from "@/components/NewNoteDialog";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import Image from "next/image";

export default async function Page() {
  const { userId } = auth();
  const notes = await db
    .select()
    .from($notes)
    .where(eq($notes.userId, userId!));

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="pt-24 px-10 w-screen flex flex-col gap-4">
          <h1 className="text-2xl font-bold">My notes</h1>
          <NewNoteDialog />
          {notes.length === 0 ? (
            <h2>You have no notes yet</h2>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {notes.map((note) => (
                <li>
                  <a href={`dashboard/note/${note.id}`} key={note.id} className="overflow-hidden flex flex-col hover:shadow-lg border border-slate-300 rounded-xl">
                    <Image
                      width={400}
                      height={200}
                      alt={note.name}
                      src={note.imageUrl || ""}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900">{note.name}</h3>
                      <p className="text-sm text-slate-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
