import { updateDom } from "./schedular"

import { SeactElement } from "./types"
export function createDom(element: SeactElement): Text | HTMLElement {
  console.log("new function gets called")
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type)

  updateDom(dom, {}, element.props)
  return dom
}
