import { Prop, Child, SeactElement } from "./types";


export function createElement(
  type: string,
  props: Prop | null = {},
  ...children: Child[]
): SeactElement {
  return {
    type,
    props: {
      ...(props),
      children: children.map((child: Child): any =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

export function createTextElement(text: Child) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
