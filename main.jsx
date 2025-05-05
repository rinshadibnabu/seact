import { Seact } from "./Seact/index.ts";
import { render } from "./Seact/schedular.ts";
/** @jsx Seact.createElement */
const element = (
  <div id="foo">
    <a>hello</a>
    <b />
  </div>
);


const container = document.getElementById("root")
render(element, container)
