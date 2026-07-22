export type InlineLinkSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInlineLinks(text: string): InlineLinkSegment[] {
  const segments: InlineLinkSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(markdownLinkPattern)) {
    const index = match.index ?? 0;

    if (index > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, index) });
    }

    segments.push({ type: "link", label: match[1], href: match[2] });
    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: text }];
}
