import { createDom } from "./createDom";
import { SeactElement, Fiber } from "./types";

let nextUnitOfWork: any = null;
let wipFiber = null
let hookIndex = null
let wipRoot: any = null
let currentRoot = null
let deletions = null
export function render(element: Fiber | SeactElement, container: HTMLElement): void {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot
  }

  nextUnitOfWork = wipRoot
  deletions = []
}

export function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop);

}

function commitRoot(): void {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

export function updateDom(dom, prevProps, nextProps) {
  const isEvent = key => key.startsWith("on")
  const isProperty = key =>
    key !== "children" && !isEvent(key)
  const isNew = (prev, next) => key =>
    prev[key] !== next[key]
  const isGone = (prev, next) => key => !(key in next)

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })

}
function commitWork(fiber: Fiber): void {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent
  while (!domParentFiber) {
    domParentFiber = fiber.parent
  }

  const domParent = domParentFiber

  if (
    fiber.effectTag == "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag == "DELETION") {
    commitDeletion(fiber, domParent)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )

  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)


}

function commitDeletion(fiber: Fiber, domParent: HTMLElement) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function performUnitOfWork(fiber: Fiber): any {
  let isFunction = fiber.type instanceof Function
  if (isFunction) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  if (fiber.child) {
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

function updateFunctionComponent(fiber: Fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const childrenElement = [fiber.type(fiber.props)]
  reconcileChildren(fiber, fiber.props.children)
}
function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  const element = fiber.props.children
  reconcileChildren(fiber, element)


}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[index]

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  const setState = action => {
    hook.queue
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }
  wipFiber.hook.push(hook)

  return [hook.state, setState]
}
function reconcileChildren(wipFiber: Fiber, element): void {

  let index = 0
  let oldFiber: Fiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null
  while (
    index < elements.length ||
    oldFiber != null
  ) {

    const element: Fiber = elements[index]
    let newFiber: Fiber = null
    const sameType =
      oldFiber &&
      element &&
      element.type = oldFiber.type
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipRoot,
        alternate: oldFiber,
        effectTag: "UPDATE"
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      }
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}
requestIdleCallback(workLoop)
