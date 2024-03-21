"use client";

import AddNewCodeSnippetButton from "@/components/add-new-code-snippet-button";
import { CodeSnippetsTable } from "@/components/code-snippets-table";
import { getAllCodeSnippets } from "@/lib/actions/user.actions";
import { Codeuser } from "@prisma/client";
import { useEffect, useState, useCallback } from "react";

const Home = () => {
  const [codeSnippets, setCodeSnippets] = useState<Codeuser[]>([]);

  const getData = useCallback(async () => {
    const codeSnippets = await getAllCodeSnippets();
    setCodeSnippets(codeSnippets);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="h-full w-full overflow-auto flex flex-col gap-5 px-4 md:px-20 lg:px-20 py-5 pt-20">
      <AddNewCodeSnippetButton />
      <CodeSnippetsTable data={codeSnippets} />
    </div>
  );
};

export default Home;
