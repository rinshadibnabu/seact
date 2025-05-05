import { SeactElement } from "./types"

export function createDom(element: SeactElement): Text | HTMLElement {
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

  return dom
}
