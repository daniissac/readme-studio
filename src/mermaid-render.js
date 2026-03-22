import mermaid from 'mermaid';

let mermaidInitialized = false;
let renderCounter = 0;

export function initMermaid(darkMode) {
  mermaid.initialize({
    startOnLoad: false,
    theme: darkMode ? 'dark' : 'default',
    securityLevel: 'strict',
  });
  mermaidInitialized = true;
}

export async function renderMermaidBlocks(container) {
  if (!mermaidInitialized) initMermaid(false);

  const codeBlocks = container.querySelectorAll('code.hljs.language-mermaid');
  for (const code of codeBlocks) {
    const pre = code.parentElement;
    if (!pre || pre.tagName !== 'PRE') continue;

    const graphDefinition = code.textContent;
    const id = `mermaid-${renderCounter++}`;

    try {
      const { svg } = await mermaid.render(id, graphDefinition);
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-diagram';
      wrapper.innerHTML = svg;
      pre.replaceWith(wrapper);
    } catch {
      pre.classList.add('mermaid-error');
    }
  }
}
