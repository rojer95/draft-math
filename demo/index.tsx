import React from "react";
import ReactDOM from "react-dom";

import MathEditor from "../src/index";

interface IProps {}
interface IState {
  html: string;
}
class Demo extends React.Component<IProps, IState> {
  state = {
    html: String.raw`<p>请问\(\oint_{L}\overrightarrow{f}\  \cdot d\ \overrightarrow{I} = ∯_{S}\nabla \times \overrightarrow{f}\  \bullet d\ \overrightarrow{S}\)是数学中的斯托克斯公式，由该公式可推得某些电磁学定律，下面对该公式物理意义描述正确的是：(    )</p>`,
  };
  onChange = (html: string) => {
    this.setState({
      html,
    });
  };

  render(): JSX.Element {
    return (
      <MathEditor value={this.state.html} onChange={this.onChange} debug />
    );
  }
}

window.render = () => {
  ReactDOM.render(<Demo />, document.getElementById("root"));
};
