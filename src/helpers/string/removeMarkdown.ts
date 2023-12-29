export default function removeMarkdown(markdown: string): string {
  // Remove bold text
  markdown = markdown.replace(/\*\*(.+?)\*\*/g, "");

  // Remove italicized text
  markdown = markdown.replace(/_(.+?)_/g, "");
  markdown = markdown.replace(/\*(.+?)\*/g, "");

  // Remove strikethrough text
  markdown = markdown.replace(/~~(.+?)~~/g, "");

  // Remove inline code blocks
  markdown = markdown.replace(/`(.+?)`/g, "");

  // Remove code blocks
  markdown = markdown.replace(/```[\s\S]*?```/g, "");

  // Remove links
  markdown = markdown.replace(/\[(.+?)\]\((.+?)\)/g, "");

  // Remove images
  markdown = markdown.replace(/!\[(.+?)\]\((.+?)\)/g, "");

  // Remove headings
  markdown = markdown.replace(/^#+\s+(.+?)\s*$/gm, "");
  markdown = markdown.replace(/^\s*=+\s*$/gm, "");
  markdown = markdown.replace(/^\s*-+\s*$/gm, "");

  // Remove blockquotes
  markdown = markdown.replace(/^\s*>\s+(.+?)\s*$/gm, "");

  // Remove lists
  markdown = markdown.replace(/^\s*[\*\+-]\s+(.+?)\s*$/gm, "");
  markdown = markdown.replace(/^\s*\d+\.\s+(.+?)\s*$/gm, "");

  // Remove horizontal lines
  markdown = markdown.replace(/^\s*[-*_]{3,}\s*$/gm, "");

  return markdown;
}
