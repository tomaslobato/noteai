import Header from "@/components/Header";
import NewNoteDialog from '@/components/NewNoteDialog'

export default function Page() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="pt-24 px-10 w-screen flex flex-col gap-4">
          <h1 className="text-2xl font-bold">My notes</h1>
          <NewNoteDialog />
          <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
            
          </ul>
        </div>
      </div>
    </>
  );
}
