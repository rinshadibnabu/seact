import { createDom } from "./createDom";
import { SeactElement, Fiber } from "./types";

let nextUnitOfWork: any = null;

export function render(element: SeactElement, container: HTMLElement) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}

export function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber: Fiber): any {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber.dom)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null

    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  if (fiber.chlid) {
    return fiber.child
  }
  let nextFiber = fiber


  while (nextFiber) {
    if (nextFiber) {
      return nextFiber.sibling
    }

    nextFiber = nextFiber.parent
  }



  console.log("performing unit", fiber);
  return null;
}

export function scheduleWork(root: any) {
  nextUnitOfWork = root;
  requestIdleCallback(workLoop);
}
