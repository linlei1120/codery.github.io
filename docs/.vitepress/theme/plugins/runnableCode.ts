import type MarkdownIt from "markdown-it";

/**
 * 为带 `runnable` 标记的代码块追加「运行」按钮，保留 VitePress 默认高亮样式。
 *
 * 用法：```js runnable
 */
export function runnableCodePlugin(md: MarkdownIt) {
  const defaultFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();

    if (!/\brunnable\b/.test(info)) {
      return defaultFence(tokens, idx, options, env, self);
    }

    const lang = info.replace(/\brunnable\b/g, "").trim().split(/\s+/)[0] || "js";
    const template = lang === "ts" ? "vanilla-ts" : "vanilla";
    const highlighted = defaultFence(tokens, idx, options, env, self);
    const code = encodeURIComponent(token.content);

    return `<div class="vp-runnable-code">${highlighted}<CodeRunner code="${code}" lang="${lang}" template="${template}" /></div>`;
  };
}
