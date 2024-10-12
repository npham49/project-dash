"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Edit } from "lucide-react";
import TailwindEditor from "./editor";

export default function EditNotesDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Edit className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-[1600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          <DialogDescription>Update the notes for this task.</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto">
          <TailwindEditor />
        </div>
      </DialogContent>
    </Dialog>
  );
}
