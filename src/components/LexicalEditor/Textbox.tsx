import React, { MutableRefObject, useEffect, useRef, useState } from "react";

import {
  $getRoot,
  $getSelection,
  $setSelection,
  type EditorState,
} from "lexical";
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

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import { EQUATION } from "./plugins/EquationPlugin/EquationTransformer";
import { EquationNode } from "./plugins/EquationPlugin/EquationNode";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { AnimatePresence, motion } from "framer-motion";
import { useFaurmStore } from "@/store/store";
// import { useStore } from "../store/store";

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

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

function MyCustomAutoFocusPlugin({
  // toolbar,
  editorState,
}: {
  // toolbar: boolean;
  editorState: MutableRefObject<EditorState | undefined>;
}) {
  const [editor] = useLexicalComposerContext();
  // const setForm = useStore((state) => state.setForm);

  useEffect(() => {
    // editor.focus();
    // setForm({
    //   // question: JSON.stringify(editor.getEditorState()),
    //   question: editor.getEditorState(),
    //   options: [],
    // });
    editor.update(() => {
      $setSelection(null);
    });
    editorState.current = editor.getEditorState();
  }, [editor, editorState]);

  return null;
}

function onError(error: any) {
  console.error(error);
}

const Placeholder: React.FC = () => (
  <div className="absolute top-0 left-0 z-0 inline-block p-2 overflow-hidden pointer-events-none select-none whitespace-nowrap text-neutral-400 text-ellipsis">
    Enter Question Here...
  </div>
);

const Textbox: React.FC<{
  disabled?: MutableRefObject<boolean>;
  editorState: MutableRefObject<EditorState | undefined>;
  id: string;
}> = ({ disabled = { current: false }, editorState, id }) => {
  // const setClose = useStore((state) => state.setClose);
  // const form = useStore((state) => state.form);
  // const form = useStore((state) => state.forms.get(id));
  const timeout = useRef<NodeJS.Timeout>();
  let t: NodeJS.Timeout;
  const [toolbar, setToolbar] = useState(false);

  // const setToolbar = useFaurmStore((state) => state.setToolbar);
  // const toolbar = useFaurmStore((state) => state.toolbar);

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
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      EquationNode,
    ],
    // editorState: (editor) => {
    //   if (!form.question) return null;
    //   return editor.setEditorState(editor.parseEditorState(form.question));
    // },

    // editorState: (editor) => {
    // if (!form || !form.question) return;
    // editor.setEditorState(form.question);
    // },
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
    <LexicalComposer initialConfig={initialConfig}>
      <div
        // data-no-dnd="true"
        onBlur={() => {
          // if (toolbarRef.current) toolbarRef.current(false);

          timeout.current = setTimeout(() => {
            setToolbar(false);
            // setClose(true);
          }, 10);
        }}
        onFocus={(e) => {
          // if (disabled.current) {
          //   e.target.blur();
          //   return;
          // }

          clearTimeout(timeout.current);

          // if (toolbarRef.current) toolbarRef.current(true);

          setToolbar(true);
          // setClose(false);
        }}
        className={`flex flex-col rounded-sm w-80 bg-neutral-800 ring-offset-1  ring-offset-neutral-900 ring-neutral-200 ${
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
            {toolbar && <ToolbarPlugin />}
          </motion.div>
        </AnimatePresence>

        <div className="relative w-full rounded-sm bg-neutral-700">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-required
                className="p-2 overflow-y-auto rounded-sm outline-none editor-scroll max-h-40 "
              />
            }
            placeholder={Placeholder}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* <OnChangePlugin
            onChange={(editorState) => {
              setForm({
                id: "",
                question: editorState,
                options: [],
              });
            }}
          /> */}
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={[...TRANSFORMERS, EQUATION]} />
          <CodeHighlightPlugin />
          <HistoryPlugin />
          <EquationsPlugin />
          <MyCustomAutoFocusPlugin
            // toolbar={toolbar}
            editorState={editorState}
          />
        </div>
      </div>
    </LexicalComposer>
  );
};
export default Textbox;
