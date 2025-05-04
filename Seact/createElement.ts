type Prop = Record<string, any>;
type Child = string | number | null | boolean | VirtualElement;

interface VirtualElement {
  type: string;
  props: {
    [key: string]: any;
    children: Child[];
  };
}

export function createElement(
  type: string,
  props: Prop | null = {},
  ...children: Child[]
): VirtualElement {
  console.log("creating Element", type)
  return {
    type,
    props: {
      ...(props || {}),
      children: children.map((child) =>
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
