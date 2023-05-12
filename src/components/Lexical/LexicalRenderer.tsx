import React from "react";

import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import EquationsPlugin from "./plugins/EquationPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import { EquationNode } from "./plugins/EquationPlugin/EquationNode";
import { defaultTextboxState } from "./LexicalTextbox";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};

function onError(error: any) {
  console.error(error);
}

const Placeholder: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <div className="absolute top-0 left-0 z-0 inline-block w-full p-2 overflow-hidden pointer-events-none select-none whitespace-nowrap text-neutral-400 text-ellipsis">
    {placeholder ?? "Enter Question Here..."}
  </div>
);

const LexicalRenderer: React.FC<{
  id: string;
  title?: string;
  placeholder?: string;
  className?: string;
}> = ({ id, title, placeholder, className }) => {
  const initialConfig: InitialConfigType = {
    editable: false,
    theme,
    namespace: `Editor ${id}`,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      LinkNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      EquationNode,
    ],
    editorState(editor) {
      if (!title)
        return editor.setEditorState(
          editor.parseEditorState(defaultTextboxState)
        );

      return editor.setEditorState(editor.parseEditorState(title));
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        data-no-dnd="true"
        className="flex flex-col h-full rounded-sm max-w-[256px] bg-neutral-800 ring-offset-1 ring-offset-neutral-900 ring-neutral-200 focus-within:ring-2"
      >
        <div className={`relative w-full rounded-sm ${className}`}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                readOnly
                className="p-2 overflow-y-auto rounded-sm outline-none editor-scroll max-h-40 "
              />
            }
            placeholder={<Placeholder placeholder={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <LinkPlugin />
          <ListPlugin />
          <CodeHighlightPlugin />
          <HistoryPlugin />
          <EquationsPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
export default LexicalRenderer;
