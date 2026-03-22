export function generateTOC(markdownText) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdownText)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }

  if (headings.length === 0) return '';

  const minLevel = Math.min(...headings.map((h) => h.level));

  const lines = headings.map((h) => {
    const indent = '  '.repeat(h.level - minLevel);
    const anchor = githubAnchor(h.text);
    return `${indent}- [${h.text}](#${anchor})`;
  });

  return '## Table of Contents\n\n' + lines.join('\n') + '\n';
}

function githubAnchor(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
