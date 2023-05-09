import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { EditorState } from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import EquationsPlugin from "./plugins/EquationPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import { EQUATION } from "./plugins/EquationPlugin/EquationTransformer";
import { EquationNode } from "./plugins/EquationPlugin/EquationNode";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

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

export const defaultTextboxState =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

// export const defaultTextboxState =
//   '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Question","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

// function MyCustomAutoFocusPlugin() {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     editor.update(() => {
//       $setSelection(null);
//     });
//   }, [editor]);

//   return null;
// }

function onError(error: any) {
  console.error(error);
}

const Placeholder: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <div className="absolute top-0 left-0 z-0 inline-block w-full p-2 overflow-hidden pointer-events-none select-none whitespace-nowrap text-neutral-400 text-ellipsis">
    {placeholder ?? "Enter Text Here..."}
  </div>
);

const LexicalTextbox: React.FC<{
  id: string;
  editorStateRef?: MutableRefObject<string | undefined>;
  placeholder?: string;
  minHeight?: string | number;
}> = ({ id, editorStateRef, placeholder, minHeight }) => {
  const eState = useRef<EditorState>();

  const timeout = useRef<NodeJS.Timeout>();
  let t: NodeJS.Timeout;
  const [toolbar, setToolbar] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    return () => {
      if (!eState.current) return;
      if (editorStateRef)
        editorStateRef.current = JSON.stringify(eState.current);
    };
  }, [id, editorStateRef]);

  useEffect(() => {
    setDisabled(false);
  }, []);

  const initialConfig: InitialConfigType = {
    theme,
    namespace: `Editor ${id}`,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      EquationNode,
    ],
    editorState(editor) {
      if (!editorStateRef || !editorStateRef.current)
        return editor.setEditorState(
          editor.parseEditorState(defaultTextboxState)
        );

      return editor.setEditorState(
        editor.parseEditorState(editorStateRef.current)
      );
    },
  };

  // ? If rerenders cause perf issues:
  // * 1. Switch back to focus-within:ring-2 instead of using toolbar for styling.
  // * 2. Put toolbar code snippet (with Animate Presence) in a separate component and use ContextAPI to pass state to the new component and set it from this component.

  // ? The occasional focusing on toolbar is only being caused due to testing (i.e. focusing and bluring in rapid succession, fast enough that the toolbar does not finish the animation and unmount), but if it is getting out of hand:
  // * 1. Again put the toolbar code snippet in a separate component.
  // * 2. Create another boolean state that is true onAnimationStart and false onAnimationEnd.
  // * 3. Pass this state on to ToolbarPlugin as disabled state and pass it to every focusable element as their disabled property.
  // ? Considering they already have !isEditable as disabled, the property would look like: (!isEditable || disabled)

  return (
    // TODO: Implement a word limit
    <LexicalComposer initialConfig={initialConfig}>
      <div
        onKeyDownCapture={(e) => e.stopPropagation()}
        data-no-dnd="true"
        onBlur={() => {
          timeout.current = setTimeout(() => {
            setToolbar(false);
          }, 100);

          if (!eState.current) return;
          if (editorStateRef)
            editorStateRef.current = JSON.stringify(eState.current);
        }}
        onFocus={(e) => {
          if (disabled) {
            e.target.blur();
            return;
          }

          clearTimeout(timeout.current);
          setToolbar(true);
        }}
        className={`flex flex-col h-full rounded-sm max-w-[256px] bg-neutral-800 ring-offset-1 ring-offset-neutral-900 ring-neutral-200 ${
          toolbar ? "ring-2" : ""
        }`}
      >
        <AnimatePresence>
          <motion.div
            key={toolbar.toString()}
            className="w-full"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            {toolbar && !disabled && <ToolbarPlugin />}
          </motion.div>
        </AnimatePresence>

        <div className="relative w-full rounded-sm bg-neutral-700">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-required
                style={{ minHeight }}
                className="p-2 overflow-y-auto rounded-sm outline-none editor-scroll max-h-40 "
              />
            }
            placeholder={<Placeholder placeholder={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              eState.current = editorState;
            }}
          />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={[...TRANSFORMERS, EQUATION]} />
          <CodeHighlightPlugin />
          <HistoryPlugin />
          <EquationsPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
export default LexicalTextbox;
