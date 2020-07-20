import React from "react";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  ContentState,
  Modifier,
  SelectionState,
  convertToRaw,
  EditorChangeType,
  ContentBlock,
} from "draft-js";
import Immutable from "immutable";
import "draft-js/dist/Draft.css";

import styled from "styled-components";

import decorator from "./decorator";
import { latex2state, state2latex, getSelectedEntityKey } from "./util";
import EditorContext from "./context";
import Mathlive from "./mathlive";

import "./icon.less";

const EditorContainer = styled.div`
  border: 1px solid #eee;
  width: 700px;

  .toolbar {
    border-bottom: 1px solid #eee;
    height: 40px;
    display: flex;
    align-items: center;
    .btn {
      width: 34px;
      height: 34px;
      cursor: pointer;
      text-align: center;
      line-height: 34px;
      margin: 0px 6px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .draft-editor {
    min-height: 300px;
    padding: 12px;
  }
`;

/**
 * 光标移动到末尾
 * @param editorState editState
 */
const moveSelectionToEnd = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const key = blockMap.last().getKey();
  const length = blockMap.last().getLength();
  const selection = new SelectionState({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });
  return EditorState.acceptSelection(editorState, selection);
};

const compositeDecorator = new CompositeDecorator(decorator);

const getSelectedIsEntity = (editorState: EditorState) => {
  const contentState: ContentState = editorState.getCurrentContent();
  const selection: SelectionState = editorState.getSelection();
  const block: ContentBlock = contentState.getBlockForKey(
    selection.getStartKey()
  );
  const entityKey = block.getEntityAt(selection.getStartOffset());
  return !!entityKey;
};

class Question extends React.Component<
  {
    value: string;
    onChange: any;
    debug?: boolean;
  },
  { editorState: EditorState }
> {
  constructor(props: any) {
    super(props);
    this.math = null;
    this.state = {
      editorState: EditorState.createWithContent(
        latex2state(props.value),
        compositeDecorator
      ),
    };
  }

  math: Mathlive | null;

  onChange = (editorState: EditorState) => {
    const latex = state2latex(editorState.getCurrentContent());
    this.props.onChange(latex);
    this.setState({
      editorState,
    });
  };

  add = (
    str: string,
    entity_type: string | boolean = false,
    entity_data: any = {}
  ) => {
    if (getSelectedEntityKey(this.state.editorState) !== null) return;

    const editorState: EditorState = this.state.editorState;
    const selection: SelectionState = editorState.getSelection();
    if (selection.isCollapsed()) {
      let key;
      let contentState: ContentState = editorState.getCurrentContent();
      if (typeof entity_type === "string") {
        contentState = contentState.createEntity(entity_type, "IMMUTABLE", {
          ...entity_data,
          editor: this,
        });
        key = contentState.getLastCreatedEntityKey();
      }

      const newContentState: ContentState = Modifier.insertText(
        contentState,
        selection,
        str,
        Immutable.OrderedSet.of(""),
        key
      );

      this.setState(
        {
          editorState: EditorState.push(
            editorState,
            newContentState,
            "insert-characters"
          ),
        },
        () => {
          if (typeof entity_type === "string") this.add(" ");
        }
      );
    }
  };

  removeRange = (key: string, start: number, end: number) => {
    const editorState: EditorState = this.state.editorState;
    const contentState: ContentState = editorState.getCurrentContent();
    const selection = new SelectionState({
      anchorKey: key,
      anchorOffset: start,
      focusKey: key,
      focusOffset: end,
    });
    const newContentState: ContentState = Modifier.removeRange(
      contentState,
      selection,
      "forward"
    );
    this.setState({
      editorState: EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      ),
    });
  };

  toEnd = () => {
    const editorState = moveSelectionToEnd(this.state.editorState);
    this.setState({ editorState }, () => {
      if (this.refs.editor) {
        (this.refs.editor as HTMLElement).focus();
      }
    });
  };

  handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ) => {
    return getSelectedEntityKey(editorState) !== null
      ? "handled"
      : "not-handled";
  };

  focus = () => {
    if (this.refs.editor) {
      (this.refs.editor as HTMLElement).focus();
    }
  };

  editMath = (latex: string, cb?: any) => {
    if (this.math) {
      this.math.open(latex, cb);
    }
  };

  update = (contentState: ContentState, changeType: EditorChangeType) => {
    this.setState({
      editorState: EditorState.push(
        this.state.editorState,
        contentState,
        changeType
      ),
    });
  };

  addMath = () => {
    this.editMath("", (latex: string) => {
      this.add("$LATEX$", "MATH", {
        latex,
      });
    });
  };

  render() {
    const { debug = false } = this.props;
    return (
      <EditorContext.Provider
        value={{
          removeRange: this.removeRange,
          editMath: this.editMath,
          update: this.update,
        }}
      >
        <EditorContainer>
          <div className="toolbar">
            <div className="btn" onClick={this.addMath}>
              <span className="draft-editor-icon">&#xe650;</span>
            </div>

            <div className="btn">
              <span className="draft-editor-icon">&#xe607;</span>
            </div>
            <div
              className="btn"
              onClick={() => {
                this.add(" (    ) ", "BRACKETS");
              }}
            >
              <span className="draft-editor-icon">&#xe920;</span>
            </div>

            <div
              className="btn"
              onClick={() => {
                this.add(" ____ ", "INPUTS");
              }}
            >
              <span className="draft-editor-icon">&#xe646;</span>
            </div>
            {debug && (
              <button
                onClick={() => {
                  const editorState: EditorState = this.state.editorState;
                  const selection: SelectionState = editorState.getSelection();
                  console.log(selection.serialize());
                  const contentState = editorState.getCurrentContent();
                  console.log(convertToRaw(contentState));
                }}
              >
                log
              </button>
            )}
          </div>

          <Mathlive ref={(math) => (this.math = math)} />

          <div className="draft-editor" onClick={this.focus}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              handleBeforeInput={this.handleBeforeInput}
              ref="editor"
            />
          </div>
        </EditorContainer>
      </EditorContext.Provider>
    );
  }
}

export default Question;
