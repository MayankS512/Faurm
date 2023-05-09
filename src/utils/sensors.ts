import { KeyboardSensor, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { KeyboardEvent, MouseEvent, TouchEvent } from "react";

export class CustomMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class CustomTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: ({ nativeEvent: event }: TouchEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

// Not Used ATM
export class CustomKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: "onKeyDown" as const,
      handler: ({ nativeEvent: event }: KeyboardEvent<Element>) => {
        const allowList = ["Enter", " ", "ArrowLeft", "ArrowRight"];

        if (!allowList.includes(event.key)) return false;
        if (!shouldHandleEvent(event.target as HTMLElement)) return false;
        return true;
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}
