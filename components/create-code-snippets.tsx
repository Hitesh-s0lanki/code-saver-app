"use client";

import { formSchema, formSchemaType } from "@/validator/create-code-snippet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { getLanguageId, preferLanguage } from "@/lib/utils";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { RunCode } from "@/lib/actions/run-code";
import { Error, Output } from "@/types/type";
import { createCodeSnippet } from "@/lib/actions/user.actions";
import Loading from "./loading";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateCodeSnippet = () => {
  const router = useRouter();

  const [language, setLanguage] = useState<string>("c");
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<null | Output>();
  const [error, setError] = useState<null | Error>(null);
  const [loading, setLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      description: "",
      language: "C",
      input: false,
      example: "",
    },
  });

  const editorRef = useRef(null);
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    fontSize: 15,
    formatOnType: true,
    minimap: {
      enabled: true,
      scale: 0,
    },
  };

  const onRun = () => {
    if (!code) {
      toast.warning("Code is required");
      return;
    }

    setOutput(null);
    setError(null);

    if (form.getValues("input") && !form.getValues("example")) {
      toast.warning("Input is Required or else turn off input");
      return;
    }

    let stdin = form.getValues("example") || null;

    if (!form.getValues("input")) {
      stdin = null;
    }

    setRunLoading(true);

    RunCode(getLanguageId(form.getValues("language")), code, stdin)
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

  const onSubmit = (values: formSchemaType) => {
    if (values.input && !values.example) {
      toast.warning("Input is require!");
      return;
    }

    if (!code) {
      toast.warning("Code can't be empty!");
      return;
    }

    setLoading(true);

    const { username, description, example } = values;

    createCodeSnippet({
      source_code: code,
      description,
      username,
      input: example,
      token: output ? output.token : "",
      language,
    })
      .then((response) => {
        toast.success("Code Snippet created Successfully");
        router.replace("/");
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full px:4 md:px-10 lg:px-10 py-5 flex justify-center items-center overflow-auto pt-20">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full lg:w-2/3 md:w-2/3 flex justify-start gap-3 flex-col"
        >
          <div className="flex flex-col gap-1">
            <div className=" flex flex-row gap-2 items-center">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className=" border-none"
                size="icon"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <h1 className=" font-semibold text-xl">
                Create your <span className=" text-yellow-500">Code</span>{" "}
                Snippets
              </h1>
            </div>
            <h2 className=" text-muted-foreground pl-5">
              {"  "}Save your code and run online.
            </h2>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="w-1/2"
                      placeholder="hitesh4623"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full px-1 md:px-5 lg:px-5 flex flex-col gap-4">
            <div className=" h-[500px] border-2 border-dotted w-full rounded-lg p-5 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(e) => {
                          setLanguage(e.toLowerCase());
                          field.onChange(e);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {preferLanguage.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Editor
                height={390}
                language={language}
                value={code}
                onChange={(e: any) => setCode(e)}
                onMount={handleEditorDidMount}
                options={editorOptions}
              />
            </div>

            <div className="w-full flex flex-col gap-3">
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                    <div className="w-1/2 flex flex-col gap-3">
                      <FormLabel className="text-base">Input</FormLabel>
                      <FormDescription>
                        Input required from the user.
                      </FormDescription>
                      {showInput && (
                        <FormField
                          control={form.control}
                          name="example"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  className="w-full"
                                  placeholder="2 3 4 5 6"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is an Example shown to user who run the
                                code.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e: any) => {
                          setShowInput(e);
                          field.onChange(e);
                        }}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {output && (
              <div className="p-5 w-full border-2 flex flex-col gap-2 rounded-lg">
                <h1 className="text-xl font-semibold">Output</h1>
                <pre>{output.stdout}</pre>
                <p>Time : {output?.time}</p>
              </div>
            )}
            {error && (
              <div className="p-5 w-full border-2 flex flex-col gap-2 rounded-lg">
                <h1 className="text-xl font-semibold">Error</h1>
                <pre>{error.stderr}</pre>
              </div>
            )}

            <div className="w-full p-5 pb-10 flex gap-2 items-center justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={onRun}
                disabled={runLoading}
              >
                {runLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {runLoading ? "Please wait" : "Run"}
              </Button>
              <Button
                className=" bg-green-600"
                type="submit"
                disabled={runLoading}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodeSnippet;
