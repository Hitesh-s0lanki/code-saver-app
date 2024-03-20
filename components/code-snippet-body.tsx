"use client";

import { useCallback, useEffect, useState } from "react";
import Loading from "./loading";
import { useCodeSnippetSheet } from "@/hooks/use-code-snippet";
import { Codeuser } from "@prisma/client";
import { getCodeSnippetById } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import ReactMarkDown from "react-markdown";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Output, Error } from "@/types/type";
import { RunCode } from "@/lib/actions/run-code";
import { getLanguageId } from "@/lib/utils";

const formSchema = z.object({
  input: z.string(),
});

type formSchemaType = z.infer<typeof formSchema>;

const CodeSnippetBody = () => {
  const [output, setOutput] = useState<null | Output>();
  const [error, setError] = useState<null | Error>(null);
  const [runLoading, setRunLoading] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [codeSnippet, setCodeSnippet] = useState<null | Codeuser>(null);

  const { id } = useCodeSnippetSheet();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const getCodeSnippet = useCallback(() => {
    if (id) {
      getCodeSnippetById(id)
        .then((response) => setCodeSnippet(response))
        .catch((error) => toast.error(error.message))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const onSubmit = (values: formSchemaType) => {
    if (!codeSnippet) return;

    if (codeSnippet?.input && !values.input) {
      toast.warning("Input is Required");
      return;
    }

    let stdin: any = null;
    if (codeSnippet?.input && values.input) {
      stdin = values.input;
    }

    setRunLoading(true);

    RunCode(
      getLanguageId(codeSnippet?.language),
      codeSnippet.source_code,
      stdin
    )
      .then((response) => {
        console.log(response);

        if (response.success) {
          toast.success(response.success);
          setOutput({
            stdout: response.stdout,
            time: response.time,
            token: response.token,
          });
        }

        if (response.error) {
          toast.error(response.status);
          setError({
            stderr: response.stderr,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => setRunLoading(false));
  };

  useEffect(() => {
    getCodeSnippet();
  }, [getCodeSnippet]);
  if (id === null || !codeSnippet) return null;
  if (loading) return <Loading />;

  return (
    <div className="w-full flex flex-col py-2 gap-3">
      <Separator />
      <p>Username : {codeSnippet.username}</p>
      <p>Language : {codeSnippet.language}</p>
      <div className=" bg-gray-300 rounded-lg p-3">
        <h1 className="text-lg text-muted-foreground">Description</h1>
        <ReactMarkDown className="text-sm">
          {codeSnippet.description}
        </ReactMarkDown>
      </div>
      <div className=" bg-gray-300 rounded-lg p-3 flex flex-col gap-5">
        <h1 className="text-lg text-muted-foreground flex gap-2">
          Code{" "}
          <Copy
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => {
              toast.success("Code Copy Successfully");
              navigator.clipboard.writeText(codeSnippet.source_code);
            }}
          />
        </h1>
        <pre className=" overflow-auto">{codeSnippet.source_code}</pre>
      </div>
      {codeSnippet.input && (
        <div className=" bg-gray-300 rounded-lg p-3 flex flex-col gap-5">
          <h1 className="text-lg text-muted-foreground flex gap-2">
            Sample Input
          </h1>
          <pre className=" overflow-auto">{codeSnippet.input}</pre>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {codeSnippet.input && (
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full"
                      placeholder="2 3 4 5 6"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Refer to Sample Input</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            variant="outline"
            className=" border-2"
            type="submit"
            disabled={runLoading}
          >
            {runLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {runLoading ? "Please wait" : "Run"}
          </Button>
        </form>
      </Form>
      {output && (
        <div className="p-5 w-full border-2 flex flex-col gap-2 rounded-lg">
          <h1 className="text-xl font-semibold">Output</h1>
          <pre className=" overflow-auto">{output.stdout}</pre>
          <p>Time : {output?.time}</p>
        </div>
      )}
      {error && (
        <div className="p-5 w-full border-2 flex flex-col gap-2 rounded-lg">
          <h1 className="text-xl font-semibold">Error</h1>
          <pre className="overflow-auto">{error.stderr}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetBody;
