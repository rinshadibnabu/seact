type Prop = Record<string, any>;

interface VirtualElement {
  type: string;
  props: {
    [key: string]: any;
    children: VirtualElement[];
  };
}


export function render(element: VirtualElement, container: HTMLElement) {
  console.log("new function gets called")
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

  const isProperty = key => key !== "children"
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name]
    })
  console.log("after adding dom", dom)
  element.props.children.forEach(child => {
    render(child, dom)
  });

  container.appendChild(dom)
}
