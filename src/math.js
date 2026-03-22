import katex from 'katex';

export function mathExtension() {
  return {
    extensions: [inlineMath, blockMath],
  };
}

const inlineMath = {
  name: 'inlineMath',
  level: 'inline',
  start(src) {
    return src.indexOf('$');
  },
  tokenizer(src) {
    const match = src.match(/^\$([^\$\n]+?)\$/);
    if (match) {
      return {
        type: 'inlineMath',
        raw: match[0],
        text: match[1].trim(),
      };
    }
  },
  renderer(token) {
    try {
      return katex.renderToString(token.text, { throwOnError: false });
    } catch {
      return `<code>${token.text}</code>`;
    }
  },
};

const blockMath = {
  name: 'blockMath',
  level: 'block',
  start(src) {
    return src.indexOf('$$');
  },
  tokenizer(src) {
    const match = src.match(/^\$\$\n?([\s\S]+?)\n?\$\$/);
    if (match) {
      return {
        type: 'blockMath',
        raw: match[0],
        text: match[1].trim(),
      };
    }
  },
  renderer(token) {
    try {
      return `<div class="math-block">${katex.renderToString(token.text, {
        throwOnError: false,
        displayMode: true,
      })}</div>`;
    } catch {
      return `<pre><code>${token.text}</code></pre>`;
    }
  },
};

export function renderMathInHTML(html) {
  return html;
}
