import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { createAlertRenderer } from './alerts.js';
import { mathExtension } from './math.js';

const highlighted = markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

const marked = new Marked(highlighted);

marked.use({
  gfm: true,
  breaks: true,
  renderer: createAlertRenderer(),
});

marked.use(mathExtension());

export function renderMarkdown(src) {
  const raw = marked.parse(src);
  return DOMPurify.sanitize(raw, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
}
