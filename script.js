const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const fullScreenToggle = document.getElementById('full-screen-toggle');
const exportHtmlBtn = document.getElementById('export-html');
const exportPdfBtn = document.getElementById('export-pdf');
const toolbar = document.getElementById('toolbar');

// Configure marked to use highlight.js for code syntax highlighting
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-'
});

function updatePreview() {
    preview.innerHTML = marked.parse(editor.value);
    localStorage.setItem('markdownContent', editor.value);
    hljs.highlightAll();
}

function insertMarkdown(prefix, suffix = '') {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    editor.value = before + prefix + selection + suffix + after;
    editor.selectionStart = editor.selectionEnd = start + prefix.length + selection.length + suffix.length;
    editor.focus();
    updatePreview();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function toggleFullScreen() {
    document.body.classList.toggle('full-screen');
    fullScreenToggle.textContent = document.body.classList.contains('full-screen') ? 'Exit Full Screen' : 'Full Screen';
}

function exportHtml() {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Exported Markdown</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                code { font-family: Consolas, Monaco, 'Andale Mono', monospace; }
            </style>
        </head>
        <body>
            ${preview.innerHTML}
        </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_markdown.html';
    a.click();
    URL.revokeObjectURL(url);
}

function exportPdf() {
    alert("PDF export functionality would typically require a server-side component or a third-party library. This is a placeholder for that feature.");
}

editor.addEventListener('input', updatePreview);
darkModeToggle.addEventListener('click', toggleDarkMode);
fullScreenToggle.addEventListener('click', toggleFullScreen);
exportHtmlBtn.addEventListener('click', exportHtml);
exportPdfBtn.addEventListener('click', exportPdf);

toolbar.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const action = e.target.getAttribute('data-action');
        switch (action) {
            case 'bold':
                insertMarkdown('**', '**');
                break;
            case 'italic':
                insertMarkdown('*', '*');
                break;
            case 'h1':
                insertMarkdown('# ');
                break;
            case 'h2':
                insertMarkdown('## ');
                break;
            case 'list':
                insertMarkdown('- ');
                break;
            case 'link':
                insertMarkdown('[', '](url)');
                break;
            case 'code':
                insertMarkdown('```\n', '\n```');
                break;
        }
    }
});

// Load saved content and dark mode preference
window.addEventListener('load', () => {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
        updatePreview();
    }
    
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Initial preview
updatePreview();
