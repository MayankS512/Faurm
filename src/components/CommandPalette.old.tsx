import { Combobox, Dialog, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { TQuestion } from "./Question";
import { useRouter } from "next/router";

interface Props {
  questions?: TQuestion[];
  changeTitle?: (tile: string) => void;
  open?: (id: string) => void;
  add?: () => void;
  deleteQ?: (idx: number) => void;
  replace?: (i: number, j: number) => void;
}

const CommandPalette: React.FC<Props> = ({
  questions,
  open,
  add,
  deleteQ,
  replace,
  changeTitle,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [inp, setInp] = useState(false);
  const commands = useMemo(() => {
    const list = [
      {
        phrase: "Create New Faurm",
        action: () => {
          router.push("/create").then(() => router.reload());
        },
      },
    ];

    if (session?.user) {
      list.push({
        phrase: "View/Edit Existing Faurms",
        action: () => router.push("/view"),
      });
    } else {
      list.push({
        phrase: "Sign In",
        action: () => signIn(),
      });
    }

    if (changeTitle) {
      list.push({
        phrase: "Change Title",
        action: () => setInp(true),
      });
    }

    if (add) {
      list.push({
        phrase: "Add Question",
        action: add,
      });
    }

    if (open) {
      if (questions) {
        questions.forEach((question, idx) => {
          list.push({
            phrase: `Open Question ${idx + 1}`,
            action: () => open(question.id),
          });
        });
      }
    }

    if (deleteQ) {
      if (questions) {
        questions.forEach((_question, idx) => {
          list.push({
            phrase: `Delete Question ${idx + 1}`,
            action: () => deleteQ(idx),
          });
        });
      }
    }

    if (replace && questions) {
      for (let i = 0; i < questions.length; i++) {
        for (let j = 0; j < questions.length; j++) {
          if (i == j) continue;
          list.push({
            phrase: `Switch Question ${i + 1} with Question ${j + 1}`,
            action: () => replace(i, j),
          });
        }
      }
    }

    if (session?.user) {
      list.push({
        phrase: "Sign Out",
        action: () => signOut(),
      });
    }

    // ? FIELDS
    // if (questions && questions.length) {
    //   for (let question of questions) {
    //     question.fields
    //     list.push(
    //       "Add Field",
    //       "Add Field to Question X",
    //       "Delete Field X",
    //       "Delete Field X of Question Y",
    //       "Switch Field X with Field Y",
    //       "Switch Field X with Field Y of Question Z"
    //     );
    //   }
    // }
    // }

    return list;
  }, [session, questions, router, deleteQ, add, open, replace, changeTitle]);

  const filteredCommands = useMemo(
    () =>
      query === ""
        ? commands
        : commands.filter((command) => {
            return command.phrase.toLowerCase().includes(query.toLowerCase());
          }),
    [commands, query]
  );

  useEffect(() => {
    function openPalette(e: globalThis.KeyboardEvent) {
      if ((e.shiftKey || e.metaKey) && e.key.toUpperCase() === "K") {
        e.preventDefault();
        // e.stopPropagation();
        setShow((prev) => !prev);
      }
    }

    if (window) {
      window.addEventListener("keypress", openPalette);
    }

    return () => window.removeEventListener("keypress", openPalette);
  }, []);

  return (
    <>
      <p className="absolute bottom-0 right-0 p-4 text-base whitespace-nowrap text-neutral-600">
        Press {`"Shift + K"`} to use Command Palette.
      </p>
      <Transition.Root show={show} as={React.Fragment}>
        <Dialog
          onClose={() => {
            setShow(false);
            setInp(false);
          }}
        >
          <Transition.Child
            as={React.Fragment}
            enter="duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-neutral-950/40 " />
          </Transition.Child>
          <div className="fixed inset-0 flex justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="duration-300 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex flex-col gap-2 p-4 mt-[25vh] h-fit max-w-xl w-full">
                <Combobox
                  onChange={(command: (typeof commands)[0]) => {
                    command.action();
                    if (command.phrase === "Change Title") return;
                    setShow(false);
                  }}
                >
                  {!inp ? (
                    <Combobox.Input
                      // border-2 border-solid border-neutral-400/30
                      className="px-3 py-2 text-xl rounded-sm shadow-xl outline-none bg-neutral-500/30 backdrop-blur-md placeholder:text-neutral-400"
                      placeholder="Enter Command"
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  ) : (
                    <form
                      className="w-full"
                      onSubmit={(e) => {
                        e.preventDefault();

                        const data = new FormData(e.currentTarget);
                        const title = data.get("title");

                        if (title && changeTitle) changeTitle(title.toString());
                        setShow(false);
                        setInp(false);
                      }}
                    >
                      <input
                        autoFocus
                        type="text"
                        placeholder="Enter Title"
                        className="w-full px-3 py-2 text-xl rounded-sm shadow-xl outline-none bg-neutral-500/30 backdrop-blur-md placeholder:text-neutral-400"
                        name="title"
                      />
                    </form>
                  )}
                  {/* horizontal-scroll */}
                  <Combobox.Options className="overflow-y-auto rounded-sm shadow-xl cmd-scroll max-h-[40vh] bg-neutral-700/30 backdrop-blur-md">
                    {filteredCommands.length > 0 ? (
                      filteredCommands.map((command) => (
                        <Combobox.Option
                          as={React.Fragment}
                          key={command.phrase}
                          value={command}
                        >
                          {({ active }) => (
                            <li
                              className={`p-2 cursor-pointer px-3 ${
                                active ? " backdrop-brightness-125" : ""
                              }`}
                            >
                              {command.phrase}
                            </li>
                          )}
                        </Combobox.Option>
                      ))
                    ) : (
                      <p className="p-2 px-3 text-neutral-400">
                        No Results Found.
                      </p>
                    )}
                  </Combobox.Options>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default CommandPalette;
