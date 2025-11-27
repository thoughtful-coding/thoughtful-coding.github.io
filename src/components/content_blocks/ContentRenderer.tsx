import React from "react";
import { ContentBlock as ContentBlockData } from "../../types/data";
import TextBlock from "./TextBlock";
import CodeBlock from "./CodeBlock";
import ImageBlock from "./ImageBlock";
import VideoBlock from "./VideoBlock";

interface ContentRendererProps {
  content: ContentBlockData[];
  lessonPath: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content, lessonPath }) => {
  return (
    <div>
      {content.map((block, index) => {
        switch (block.kind) {
          case "text":
            return <TextBlock key={index} block={block} />;
          case "code":
            return <CodeBlock key={index} block={block} />;
          case "image":
            return <ImageBlock key={index} block={block} lessonPath={lessonPath} />;
          case "video":
            return <VideoBlock key={index} block={block} />;
          default: {
            const _exhaustiveCheck: never = block;
            console.warn("Unknown content block kind:", _exhaustiveCheck);
            return <div key={index}>Unsupported content block</div>;
          }
        }
      })}
    </div>
  );
};

export default ContentRenderer;
