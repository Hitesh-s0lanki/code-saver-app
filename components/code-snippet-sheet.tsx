"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCodeSnippetSheet } from "@/hooks/use-code-snippet";
import CodeSnippetBody from "./code-snippet-body";

const CodeSnippetSheet = () => {
  const { isOpen, onClose } = useCodeSnippetSheet();

  const handleClose = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-72 sm:w-full h-full overflow-auto">
        <SheetHeader>
          <SheetTitle>Code Snippet</SheetTitle>
          <SheetDescription>
            You can run the code and copy code. View the details of the code.
          </SheetDescription>
        </SheetHeader>
        <CodeSnippetBody />
      </SheetContent>
    </Sheet>
  );
};

export default CodeSnippetSheet;
