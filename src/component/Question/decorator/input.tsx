import React from "react";
import { ContentBlock, ContentState, CharacterMetadata } from "draft-js";

import styled from "styled-components";

const InputBox = styled.span`
  color: #bfbfbf;
  cursor: pointer;
`;

export const handleInput = (
  contentBlock: ContentBlock,
  callback: any,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(
    (character: CharacterMetadata) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        (contentState.getEntity(entityKey).getType() === "INPUTS" ||
          contentState.getEntity(entityKey).getType() === "BRACKETS")
      );
    },
    (start: number, end: number) => {
      callback(start, end);
    }
  );
};

export default class Input extends React.Component<{
  offsetKey: string;
}> {
  render() {
    return <InputBox>{this.props.children}</InputBox>;
  }
}
