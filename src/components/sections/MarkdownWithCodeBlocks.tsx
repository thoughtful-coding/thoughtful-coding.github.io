import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownWithCodeBlocksProps {
  text: string;
  disallowParagraphs?: boolean;
}

/**
 * Renders markdown text with proper handling for code blocks.
 * Detects triple-backtick code blocks and renders them as pre/code elements
 * to preserve formatting and indentation. Falls back to ReactMarkdown for
 * inline code and regular text.
 */
const MarkdownWithCodeBlocks: React.FC<MarkdownWithCodeBlocksProps> = ({
  text,
  disallowParagraphs = true,
}) => {
  // Detect if text contains a code block (```...```)
  const codeBlockMatch = text.match(/^```(.+?)```$/s);

  if (codeBlockMatch) {
    // Extract code and render as pre/code block
    const code = codeBlockMatch[1].trim();
    return (
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre",
          textAlign: "left",
          width: "100%",
        }}
      >
        <code>{code}</code>
      </pre>
    );
  }

  // Otherwise use ReactMarkdown for inline code and text
  if (disallowParagraphs) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        disallowedElements={["p"]}
        unwrapDisallowed={true}
      >
        {text}
      </ReactMarkdown>
    );
  }

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
};

export default MarkdownWithCodeBlocks;
