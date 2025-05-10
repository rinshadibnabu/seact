import { render } from "./Seact/schedular.ts";
/** @jsx Seact.createElement */
const element = (
  <div id="foo">
    <p>hello</p>
  </div>
);


const container = document.getElementById("root")
render(element, container)
