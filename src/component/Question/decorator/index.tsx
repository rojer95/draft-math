import { DraftDecorator } from "draft-js";
import Math, { handleMath } from "./math";
import Input, { handleInput } from "./input";

const decorator: DraftDecorator[] = [
  {
    strategy: handleMath,
    component: Math,
  },
  {
    strategy: handleInput,
    component: Input,
  },
];

export default decorator;
