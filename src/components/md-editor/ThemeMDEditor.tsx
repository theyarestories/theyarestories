import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";
import { useMedia } from "react-use";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="h-[200px] bg-gray-300 animate-pulse" />,
  }
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
  const isWide = useMedia("(min-width: 768px)", false);

  return (
    <div
      dir="ltr"
      // data-color-mode="dark"
    >
      <MDEditor
        value={value}
        onChange={(value) => onChange(value || "")}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        preview={isWide ? "live" : "edit"}
        commandsFilter={(cmd) =>
          cmd.name && /(code|comment|strikethrough|table)/.test(cmd.name)
            ? false
            : cmd
        }
      />
      {/* <div style={{ paddingTop: 50 }}>
    //   <Markdown source={value} />
    // // </div> */}
    </div>
  );
}
