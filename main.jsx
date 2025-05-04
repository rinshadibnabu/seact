import { Seact } from "./Seact/index.ts";
/** @jsx Seact.createElement */
const element = (
  <div id="foo">
    <a>hello</a>
    <b />
  </div>
);


const container = document.getElementById("root")
Seact.render(element, container)
