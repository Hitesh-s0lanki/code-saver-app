import AddNewCodeSnippetButton from "@/components/add-new-code-snippet-button";
import { CodeSnippetsTable } from "@/components/code-snippets-table";
import { getAllCodeSnippets } from "@/lib/actions/user.actions";

const Home = async () => {
  const codeSnippets = await getAllCodeSnippets();

  return (
    <div className="h-full w-full overflow-auto flex flex-col gap-5 px-4 md:px-20 lg:px-20 py-5 pt-20">
      <AddNewCodeSnippetButton />
      <CodeSnippetsTable data={codeSnippets} />
    </div>
  );
};

export default Home;
