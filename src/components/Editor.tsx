"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import EditorMenuBar from "./EditorMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import { useCompletion } from "ai/react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Loader, Trash2Icon } from "lucide-react";
import DeleteButton from "./DeleteButton";

type Props = { note: NoteType };

export default function Editor({ note }: Props) {
  const [editorState, setEditorState] = useState(
    note.editorState || `<h1>${note.name}</h1>`
  );
  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-Space": () => {
          // take the last 30 words
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = useRef("");
  useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  useEffect(() => {
    // save to db
    if (debouncedEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update!", data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, [debouncedEditorState]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-2 pb-2">
        {editor && <EditorMenuBar editor={editor} />}

        <div className="flex items-center gap-2">
          <DeleteButton noteId={note.id!}/>
          <Button
            size="sm"
            disabled={saveNote.isPending}
            variant="ghost"
            className="p-0 hover:bg-transparent"
          >
            {saveNote.isPending ? (
              <span className="flex gap-1">
                <Loader className="w-4 h-4 animate-spin" />
                Saving
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CheckCircledIcon className="h-4 w-4" /> Saved
              </span>
            )}
          </Button>
        </div>
      </div>
      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <span className="text-xs">
        <kbd className="p-1 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-200 rounded-lg">
          Cmd + Space
        </kbd>{" "}
        for AI auto completion
      </span>
      <div className="h-4"></div>
    </>
  );
}
