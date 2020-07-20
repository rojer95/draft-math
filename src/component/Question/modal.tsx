import React from "react";
import styled from "styled-components";

const Modal = styled.div<{ visiable: boolean }>`
  .mask {
    visibility: ${(props) => (props.visiable ? "visible" : "hidden")};
    position: fixed;
    z-index: 999;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    opacity: ${(props) => (props.visiable ? "1" : "0")};
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .modal-main {
    position: fixed;
    border-radius: 6px;
    z-index: 1000;
    visibility: ${(props) => (props.visiable ? "visible" : "hidden")};
    width: 700px;
    top: 100px;
    left: 50%;
    margin-left: -350px;
    min-height: 200px;
    background-color: #ffffff;
    padding: 40px;
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform: ${(props) =>
      props.visiable ? "translate3d(0, 0%, 0)" : "translate3d(0, 100%, 0)"};
    opacity: ${(props) => (props.visiable ? "1" : "0")};

    .close-btn {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
`;

const ModalComponent: React.FC<{
  children: any;
  onClose: () => void;
  visiable?: boolean;
}> = ({ children, visiable = false, onClose }) => {
  return (
    <Modal visiable={visiable}>
      <div className="mask" onClick={onClose}></div>
      <div className="modal-main">
        <div className="close-btn" onClick={onClose}>
          <span className="draft-editor-icon">&#xe602;</span>
        </div>
        {children}
      </div>
    </Modal>
  );
};

export default ModalComponent;
