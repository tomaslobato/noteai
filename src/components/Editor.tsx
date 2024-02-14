"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import EditorMenuBar from "./EditorMenuBar";
import { Button } from "./ui/button";
import { Loader, Trash2Icon } from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import { CheckCircledIcon } from "@radix-ui/react-icons";

type Props = { note: NoteType };

export default function Editor({ note }: Props) {
  const [editorState, setEditorState] = useState(note.editorState || `<h1>${note.name}</h1>`);
  const saveNote = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return res.data;
    },
  });
  
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const debouncedEditorState = useDebounce(editorState, 1000);
  useEffect(() => {
    //saving to db
    saveNote.mutate(undefined, {
      onError: (err) => console.error(err),
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-2 pb-2">
        {editor && <EditorMenuBar editor={editor} />}

        <div className="flex items-center gap-2">
          <Button variant="destructive" className="gap-1" size="sm">
            <Trash2Icon className="w-4 h-4" />
            Delete Note
          </Button>
          <Button size="sm" disabled={saveNote.isPending} variant='ghost' className="p-0 hover:bg-transparent">
            {saveNote.isPending ? (
              <span className="flex gap-1">
                <Loader className="w-4 h-4 animate-spin" />
                Saving
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CheckCircledIcon className="h-4 w-4"/> Saved
              </span>
            )}
          </Button>
        </div>
      </div>
      <div className="prose">
        <EditorContent editor={editor}/>
      </div>
    </>
  );
}
