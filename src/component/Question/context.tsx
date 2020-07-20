import React from "react";
import { ContentState, EditorChangeType } from "draft-js";

const EditorContext = React.createContext({
  removeRange: (key: string, start: number, end: number) => {},
  editMath: (latex: string, cb?: any) => {},
  update: (contentState: ContentState, changeType: EditorChangeType) => {},
});

export default EditorContext;
