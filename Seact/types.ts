export type Prop = Record<string, any>;
export type Child = string | number | null | boolean | SeactElement;
type EffectTagConst = "PLACEMENT" | "UPDATE" | "DELETION"
export interface SeactElement {
  type: string;
  props: {
    [key: string]: any;
    children: SeactElement[];
  };
}
export interface Fiber extends SeactElement {
  parent: Fiber;
  sibling: Fiber;
  child: Fiber;
  dom: HTMLElement | Text;
  alternate: Fiber;
  effectTag: EffectTagConst
}



