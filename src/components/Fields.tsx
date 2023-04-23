import { useCallback, useEffect, useState } from "react";
import DndContainer from "./DndContainer";
import { MemberVariant } from "@/utils/variants";
import { motion } from "framer-motion";
import SortableItem from "./SortableItem";
import TextInput from "./TextInput";
import IconButton from "./IconButton";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useFaurmStore } from "@/store/store";
import { useForm } from "react-hook-form";

const Fields = ({
  disable = false,
  blur = false,
  id,
}: {
  id: number | string;
  disable?: boolean;
  blur?: boolean;
}) => {
  const questions = useFaurmStore((state) => state.questions);
  const question = questions.get(id);
  let prev: number[] = [];
  if (question?.type !== "Text") {
    prev = question?.fields.map((_v, idx) => idx + 1) ?? [1, 2, 3, 4];
  }

  const [count, setCount] = useState(5);
  const [delayed, setDelayed] = useState(true);
  const [fields, setFields] = useState<number[]>(prev);

  const defaultValues: { [key: string]: string } = {};
  for (const field of fields) {
    defaultValues[field.toString()] =
      question?.type === "Text" ? "" : question?.fields[field - 1] ?? "";
  }

  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const addField = () => {
    setCount((prev) => prev + 1);
    setFields((prev) => [...prev, count]);
  };

  const removeField = (index: number) => {
    setFields((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const setQuestion = useFaurmStore((state) => state.setQuestion);
  const saveToStore = useCallback(() => {
    // setQuestion(id, { fields });
    handleSubmit((values) => {
      console.log(values);
      const options = fields.map((field) => values[field]);

      setQuestion(id, {
        fields: options,
      });
    })();
  }, [handleSubmit, setQuestion, id, fields]);

  useEffect(() => {
    setDelayed(false);

    return () => {
      if (blur) return;
      saveToStore();
    };
  }, [blur, saveToStore]);

  return (
    <DndContainer<number> items={fields} setItems={setFields}>
      <div
        onBlur={() => {
          if (!blur) return;
          saveToStore();
        }}
        className="w-full overflow-y-auto max-h-64 hidden-scroll"
      >
        {fields.length > 0 ? (
          <>
            {fields.map((val, idx) => (
              <motion.div
                variants={disable ? undefined : MemberVariant}
                initial={"close"}
                exit="close"
                animate="open"
                custom={delayed ? idx + 2 : -1}
                key={val}
                className={`px-4 py-2 w-full ${
                  idx + 1 === fields.length ? "pb-1" : ""
                }`}
                onPointerDownCapture={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") e.preventDefault();
                }}
              >
                <SortableItem className="relative rounded-sm" id={val}>
                  <TextInput
                    register={register(val.toString())}
                    side={() => removeField(idx)}
                    placeholder={`Option ${String.fromCharCode(idx + 65)}`}
                    version={1}
                  />
                </SortableItem>
              </motion.div>
            ))}
          </>
        ) : (
          <motion.p
            variants={disable ? undefined : MemberVariant}
            initial={"close"}
            exit="close"
            animate="open"
            custom={2}
            className="text-center text-neutral-400"
          >
            No Option Fields...
          </motion.p>
        )}
      </div>
      <motion.div
        variants={disable ? undefined : MemberVariant}
        initial={"close"}
        exit="close"
        animate="open"
        custom={Math.min(fields.length + 2, 7)}
        className="p-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.preventDefault();
        }}
      >
        <IconButton onClick={addField} className=" bg-neutral-700">
          <PlusIcon className="w-3 h-3" />
        </IconButton>
      </motion.div>
    </DndContainer>
  );
};

export default Fields;
