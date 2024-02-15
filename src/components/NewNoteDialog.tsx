"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {Loader} from 'lucide-react'
import { useRouter } from "next/navigation";

export default function NewNoteDialog() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const createNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNote", {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (input === "") {
      window.alert("You have to enter a name for your note");
      return;
    }
    createNote.mutate(undefined, {
      onSuccess: ({ noteId }) => {
        router.push(`dashboard/note/${noteId}`);
      },
      onError: (err) => {
        console.error(err);
        alert("Failed to create new note");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="md:w-36 border-slate-500 hover:border-slate-600 hover:bg-slate-200 border-2 p-4 h-14 flex justify-center gap-1 items-center rounded-xl">
          <PlusIcon className="w-6 h-6" strokeWidth={3} />
          <h2>New Note</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
            placeholder="Name..."
            className="border-2 border-slate-400"
          />
          <div className="flex justify-end gap-2 w-full">
            <Button variant="destructive">Cancel</Button>
            <Button type="submit" disabled={createNote.isPending}>
              {createNote.isPending ? <span className="flex items-center"><Loader className="w-4 h-4 mr-2 animate-spin"/> Generating...</span> : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
