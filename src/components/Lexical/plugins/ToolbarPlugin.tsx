import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
  $setBlocksType,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  type LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  NodeKey,
  RangeSelection,
  ElementNode,
  TextNode,
} from "lexical";
import { InsertEquationDialog } from "./EquationPlugin";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import IconButton from "../../IconButton";
import Dropdown, { DropdownOption } from "../../Dropdown";
import { motion } from "framer-motion";

// TODO: Might be time to move some components out.
// TODO: Style dropdown (Listbox) separately and reuse
// TODO: Make toolbar more responsive to width adjustments
// TODO: Farfetched ATM: Restyle toolabr for mobile use...

// Block Format

const blockTypeToBlockName = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  bullet: "Bulleted List",
  number: "Numbered List",
  code: "Code Block",
  quote: "Quote",
};

type block = keyof typeof blockTypeToBlockName;

// Code Block Options

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

// Block Dropdown Component

function BlockFormatDropDown({
  editor,
  blockType,
  setBlockType,
  disabled = false,
}: {
  blockType: block;
  setBlockType: Dispatch<SetStateAction<block>>;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    // editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }

    // editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  const changeBlock = (change: block) => {
    setBlockType(change);
    switch (change) {
      case "paragraph":
        formatParagraph();
        break;
      case "h1":
        formatHeading("h1");
        break;
      case "h2":
        formatHeading("h2");
        break;
      case "bullet":
        formatBulletList();
        break;
      case "number":
        formatNumberedList();
        break;
      case "code":
        formatCode();
        break;
      case "quote":
        formatQuote();
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      value={blockType}
      onChange={changeBlock}
      name={blockTypeToBlockName[blockType]}
      disabled={disabled}
    >
      <DropdownOption value="paragraph">Normal</DropdownOption>
      <DropdownOption value="h1">Heading 1</DropdownOption>
      <DropdownOption value="h2">Heading 2</DropdownOption>
      <DropdownOption value="bullet">Bulleted List</DropdownOption>
      <DropdownOption value="number">Numbered List</DropdownOption>
      <DropdownOption value="code">Code Block</DropdownOption>
      <DropdownOption value="quote">Quote</DropdownOption>
    </Dropdown>
  );
}

// Utils

const Divider: React.FC = () => (
  <div className="text-[1.5rem] select-none -mt-2 font-thin">|</div>
);

export function sanitizeUrl(url: string): string {
  /** A pattern that matches safe  URLs. */
  const SAFE_URL_PATTERN =
    /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

  /** A pattern that matches safe data URLs. */
  const DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  url = String(url).trim();

  if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url;

  return "https://";
}

export function getSelectedNode(
  selection: RangeSelection
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

// Toolbar Component

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [blockType, setBlockType] = useState<block>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  // const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      // if ($isLinkNode(parent) || $isLinkNode(node)) {
      //   setIsLink(true);
      // } else {
      //   setIsLink(false);
      // }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          if (type !== "check") {
            setBlockType(type);
          }
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, editor, updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
            $getNearestBlockElementAncestorOrThrow(node).setFormat("");
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  // const insertLink = useCallback(() => {
  //   if (!isLink) {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
  //   } else {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  //   }
  // }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <div
      onPointerDownCapture={(e) => e.stopPropagation()}
      className="flex items-center w-full gap-2 p-2 text-neutral-200"
    >
      {/* <IconButton
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo"
        label="Undo"
      >
        <ArrowUturnLeftIcon strokeWidth={2} className="icon" />
      </IconButton>
      <IconButton
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo"
        label="Redo"
      >
        <ArrowUturnRightIcon strokeWidth={2} className="icon" />
      </IconButton>
      <Divider /> */}

      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            setBlockType={setBlockType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        // TODO: look into Javascript turning into JS
        <Dropdown
          value={codeLanguage}
          disabled={!isEditable}
          onChange={onCodeLanguageSelect}
          name={getLanguageFriendlyName(codeLanguage)}
        >
          {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return (
              <DropdownOption value={value} key={value}>
                {name}
              </DropdownOption>
            );
          })}
        </Dropdown>
      ) : (
        // TODO: Style the buttons better, maybe use icons instead of text.
        <div className="flex gap-4 overflow-x-auto hidden-scroll">
          <IconButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
            }
            title="Bold"
            label="Format text as bold."
            active={isBold}
          >
            <FontBoldIcon className="icon" strokeWidth={2} />
          </IconButton>
          <IconButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
            title="Italic"
            label="Format text as Italics."
            active={isItalic}
          >
            <FontItalicIcon className="icon" strokeWidth={2} />
          </IconButton>
          <IconButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
            title="Underline"
            label="Format text to be underlined."
            active={isUnderline}
          >
            <UnderlineIcon className="icon" strokeWidth={2} />
          </IconButton>
          <IconButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
            title="Strikethrough"
            label="Format text with a line through."
            active={isStrikethrough}
          >
            <StrikethroughIcon className="icon" strokeWidth={2} />
          </IconButton>
          <IconButton
            disabled={!isEditable}
            onClick={() =>
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
            }
            title="Code"
            label="Format text as code."
            active={isCode}
          >
            <CodeIcon className="icon" strokeWidth={2} />
          </IconButton>
          {/* // TODO: Either Remove this or add a way to change url for link. */}
          {/* <IconButton
              disabled={!isEditable}
              onClick={insertLink}
              title="Link"
              label="Insert Link."
              active={isLink}
            >
              <LinkIcon className="icon" strokeWidth={2} />
            </IconButton> 
          */}
        </div>
      )}

      {/* //* Align Tools */}
      {/* <Divider />
      <IconButton
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        }
        label="Align text to left"
        title="Left Align"
      >
        <Bars3BottomLeftIcon className="icon" />
      </IconButton>
      <IconButton
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        }
        label="Align text to center"
        title="Center Align"
      >
     // TODO: Find or Make better Icon more in line with left and right align
        <Bars3Icon className="icon" />
      </IconButton>
      <IconButton
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        }
        label="Align text to right"
        title="Right Align"
      >
        <Bars3BottomRightIcon className="icon" />
      </IconButton>
      <IconButton
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        label="Justify Text"
        title="Justify Align"
      >
        <Bars3Icon className="icon" />
      </IconButton> */}
    </div>
  );
}

// * Removed functionality of Indentation.
/* <Divider />
<IconButton
label="Tab Outwards."
title="Tab Out"
onClick={() => {
  activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
}}
>
{">"}
</IconButton>
<IconButton
label="Tab Inwards."
title="Tab In"
onClick={() => {
  activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
}}
>
{"<"}
</IconButton> */
