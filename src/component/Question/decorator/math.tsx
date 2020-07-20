import React from "react";
import {
  ContentBlock,
  ContentState,
  CharacterMetadata,
  SelectionState,
  EditorState,
} from "draft-js";

import styled from "styled-components";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import ToolTip from "../tooptip";
import EditorContext from "../context";

const MathDisplay = styled.span`
  background-color: rgba(0, 0, 0, 0.03);
  cursor: pointer;
  padding: 0px 5px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const handleMath = (
  contentBlock: ContentBlock,
  callback: any,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(
    (character: CharacterMetadata) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "MATH"
      );
    },
    (start: number, end: number) => {
      callback(start, end);
    }
  );
};

export default class Math extends React.Component<{
  contentState: ContentState;
  entityKey: string;
  decoratedText: string;
  offsetKey: string;
  blockKey: string;
  start: number;
  end: number;
  editor: any;
}> {
  static contextType = EditorContext;

  del = () => {
    this.context.removeRange(
      this.props.blockKey,
      this.props.start,
      this.props.end
    );
  };

  edit = () => {
    const datas: any = this.props.contentState
      .getEntity(this.props.entityKey)
      .getData();

    if (datas.latex) {
      this.context.editMath(datas.latex, (newLatex: string) => {
        const newContent = this.props.contentState.replaceEntityData(
          this.props.entityKey,
          {
            latex: newLatex,
          }
        );
        this.context.update(newContent, "adjust-depth");
      });
    }
  };
  render() {
    let latex = "请编辑公式";
    if (this.props.entityKey) {
      const datas: any = this.props.contentState
        .getEntity(this.props.entityKey)
        .getData();
      if (datas.latex) {
        latex = datas.latex;
      }
    }

    return (
      <MathDisplay data-offset-key={this.props.offsetKey}>
        <ToolTip
          actions={{
            删除: this.del,
            编辑: this.edit,
          }}
        >
          <TeX math={latex} />
        </ToolTip>
      </MathDisplay>
    );
  }
}

export const getSelectedMath = (editorState: EditorState) => {
  const contentState: ContentState = editorState.getCurrentContent();
  const selection: SelectionState = editorState.getSelection();
  const block: ContentBlock = contentState.getBlockForKey(
    selection.getStartKey()
  );
  const entityKey = block.getEntityAt(selection.getStartOffset());
  if (!entityKey) return null;

  const entity = contentState.getEntity(entityKey);
  return entity.getType() === "MATH" ? entity : null;
};

export const selectedIsMath = (editorState: EditorState) => {
  return getSelectedMath(editorState) !== null;
};
