import React from "react";
import styled from "styled-components";

let actionwidth = 42;
const TipsBox = styled.span<{ len: number }>`
  position: relative;

  .tips {
    position: absolute;
    display: flex;
    color: #fff;
    background: #222;
    border: 1px solid transparent;
    font-size: 14px;
    opacity: 0.9;
    border-radius: 3px;
    left: 50%;
    top: -32px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
    width: ${(props) => `${props.len * actionwidth}px`};
    margin-left: ${(props) => `-${(props.len * actionwidth) / 2}px`};

    &::before,
    &::after {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
    }
    &::before {
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      bottom: -8px;
      left: 50%;
      margin-left: -10px;
    }
    &::after {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      bottom: -6px;
      left: 50%;
      margin-left: -8px;
      border-top-color: #222;
      border-top-style: solid;
      border-top-width: 6px;
    }

    .tip {
      width: ${`${actionwidth}px`};
      height: 22px;
      line-height: 22px;
      text-align: center;
      white-space: nowrap;
      border-right: 1px solid rgba(238, 238, 238, 0.2);

      &:last-child {
        border-right: none;
      }
    }
  }

  &:hover {
    .tips {
      visibility: visible;
      opacity: 1;
    }
  }
`;

const Tooltip: React.FC<{ children: any; actions: any }> = ({
  children,
  actions = {},
}) => {
  return (
    <TipsBox contentEditable={false} len={Object.keys(actions).length}>
      <div className="tips">
        {Object.keys(actions).map((key) => {
          return (
            <div
              key={key}
              className="tip"
              onClick={() => {
                if (actions[key]) {
                  actions[key]();
                }
              }}
            >
              {key}
            </div>
          );
        })}
      </div>
      {children}
    </TipsBox>
  );
};

export default Tooltip;
