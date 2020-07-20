import React from "react";
import styled from "styled-components";
import Modal from "./modal";

const InputBox = styled.div`
  border: 1px solid #ddd;
  padding: 5px;
  margin: 10px 0;
  border-radius: 5px;
  background: #fff;
  color: #333;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.div`
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;

  button {
    background: none;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    color: #0066ce;
    fill: currentColor;
    position: relative;
    height: 36px;
    line-height: 36px;
    min-width: 64px;
    padding: 0 16px;
    outline: none;
    cursor: pointer;
    font-size: 16px;
  }
`;

const LatexPv = styled.div`
  font-size: 14px;
  padding: 0px 5px;
  background-color: #dcdcde;
  border-radius: 3px;
  margin-bottom: 8px;
`;

class MathliveComponent extends React.Component {
  state = {
    visiable: false,
    latex: "",
  };

  componentDidMount() {
    this.mathlive = window.MathLive.makeMathField(this.node, {
      smartMode: true,
      virtualKeyboardMode: "onfocus",
      onContentDidChange: (mf: any) => {
        const _latex = mf.$text("latex-expanded");
        this.setState({
          latex: _latex,
        });
      },
    });
  }

  node: any;
  cb: null | ((latex: string) => void) = null;
  mathlive: any;

  open = (_value: string, cb: (newLatex: string) => void) => {
    this.cb = cb;
    this.mathlive.$latex(_value);
    this.setState({
      latex: _value,
      visiable: true,
    });
  };

  setVisiable = (visiable: boolean) => {
    this.setState({
      visiable,
    });
  };

  handleCb = () => {
    if (this.cb) {
      this.cb(this.state.latex);
      this.setState({
        visiable: false,
        latex: "",
      });
    }
  };

  render() {
    return (
      <Modal
        visiable={this.state.visiable}
        onClose={() => {
          this.setVisiable(false);
        }}
      >
        <Title>LATEX公式编辑器</Title>
        <InputBox ref={(node) => (this.node = node)}></InputBox>

        <LatexPv>{this.state.latex}</LatexPv>
        <Buttons>
          <button onClick={this.handleCb}>确认</button>
        </Buttons>
      </Modal>
    );
  }
}

export default MathliveComponent;
