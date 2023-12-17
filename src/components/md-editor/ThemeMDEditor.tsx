import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
// const EditerMarkdown = dynamic(
//   () =>
//     import("@uiw/react-md-editor").then((mod) => {
//       return mod.default.Markdown;
//     }),
//   { ssr: false }
// );
// const Markdown = dynamic(
//   () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
//   { ssr: false }
// );

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ThemeMDEditor({ value, onChange }: Props) {
  return (
    // <div data-color-mode="dark">
    <MDEditor
      value={value}
      onChange={(value) => onChange(value || "")}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      preview="edit"
    />
    // {/* <div style={{ paddingTop: 50 }}>
    //   <Markdown source={value} />
    // // </div> */}
    // {/* </div> */}
  );
}
