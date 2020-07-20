import { ContentState } from "draft-js";
import { convertToHTML, convertFromHTML } from "draft-convert";
import { EditorState, SelectionState, ContentBlock } from "draft-js";
/**
 * contentState 转 含有 latex的html文本
 * @param contentState contentState
 */
export const state2latex = function (contentState: ContentState) {
  let html = convertToHTML({
    entityToHTML: (entity: any, originalText: string) => {
      if (entity.type === "MATH") {
        return ` \\\(${entity.data.latex}\\\) `;
      }
      return originalText;
    },
  })(contentState);
  // html = html.replace(/<p>(\s*?)<\/p>/g, "\n");
  // html = html.replace(/<p>/g, "");
  // html = html.replace(/<\/p>/g, "");
  return html;
};

/**
 * 含有latex的html转为contentState
 * @param html html
 */
export const latex2state = function (html: string): ContentState {
  const contentState = convertFromHTML({
    textToEntity: (text: string, createEntity) => {
      const result: any[] = [];
      text.replace(/\(    \)/g, (substring: string, ...args: any[]) => {
        const [offset] = args;
        const entityKey = createEntity("BRACKETS", "IMMUTABLE", {});
        result.push({
          entity: entityKey,
          offset,
          length: substring.length,
          result: substring,
        });
        return "";
      });

      text.replace(/\_\_\_\_/g, (substring: string, ...args: any[]) => {
        const [offset] = args;
        const entityKey = createEntity("INPUTS", "IMMUTABLE", {});
        result.push({
          entity: entityKey,
          offset,
          length: substring.length,
          result: substring,
        });
        return "";
      });

      text.replace(/\\\((.*?)\\\)/g, (substring: string, ...args: any[]) => {
        const [latex, offset] = args;
        const entityKey = createEntity("MATH", "IMMUTABLE", { latex });
        result.push({
          entity: entityKey,
          offset,
          length: substring.length,
          result: "$LATEX$",
        });
        return "";
      });

      return result;
    },
  })(html);

  return contentState;
};

export const getSelectedEntityKey = (editorState: EditorState) => {
  const contentState: ContentState = editorState.getCurrentContent();
  const selection: SelectionState = editorState.getSelection();
  const block: ContentBlock = contentState.getBlockForKey(
    selection.getStartKey()
  );
  const entityKey = block.getEntityAt(selection.getStartOffset());
  return entityKey;
};
