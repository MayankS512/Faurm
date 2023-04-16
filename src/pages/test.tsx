import Textbox from "@/components/LexicalEditor/Textbox";
import { EditorState } from "lexical";
import Head from "next/head";
import React, { useRef } from "react";

const Test = () => {
  const editorState = useRef<EditorState>();
  return (
    <main className="flex w-screen h-screen bg-neutral-900">
      <Head>
        <title>Test</title>
      </Head>
      <div className="p-4 mx-auto my-auto bg-neutral-800 ">
      <Textbox id="1" editorState={editorState}/>
      </div>
    </main>
  );
};

export default Test;
