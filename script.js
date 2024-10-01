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
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
                pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
                code { font-family: Consolas, Monaco, 'Andale Mono', monospace; }
                img { max-width: 100%; height: auto; }
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
    // Create a clone of the preview element
    const clonedPreview = preview.cloneNode(true);
    
    // Create a temporary container with a white background
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.background = 'white';
    tempContainer.style.width = '800px';  // Set a fixed width for better PDF formatting
    tempContainer.style.padding = '20px';
    tempContainer.appendChild(clonedPreview);
    document.body.appendChild(tempContainer);

    html2canvas(tempContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('exported_markdown.pdf');

        // Remove the temporary container
        document.body.removeChild(tempContainer);
    });
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
