"use client";
import { Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DeleteButton({ noteId }: { noteId: number }) {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/deleteNote", {
        noteId,
      });
      return res.data;
    },
  });
  return (
    <Button
      variant="destructive"
      disabled={deleteNote.isPending}
      onClick={() => {
        const confirm = window.confirm("Do you want to delete this note?");
        if (!confirm) return;
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
      size="sm"
      className="flex items-center gap-1"
    >
      <Trash2Icon className="w-4 h-4" />
      Delete Note
    </Button>
  );
}
