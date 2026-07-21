import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://jadenneal.github.io",
  output: "static",
  server: {
    port: 3000,
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            rel: ["noopener", "noreferrer"],
            target: "_blank",
          },
        ],
      ],
    }),
  },
});
