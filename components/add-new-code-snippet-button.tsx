"use client";

import { PlusSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const AddNewCodeSnippetButton = () => {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-end">
      <Button onClick={() => router.push("/create")}>
        <PlusSquare className="mr-2 h-4 w-4" />
        Add Your Snippet
      </Button>
    </div>
  );
};

export default AddNewCodeSnippetButton;
