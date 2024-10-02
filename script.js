const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const exportPdfBtn = document.getElementById('export-pdf');
const toolbar = document.getElementById('toolbar');
const downloadMdBtn = document.getElementById('download-md');
const expandToggle = document.getElementById('expand-toggle');


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


function downloadMd() {
    const content = editor.value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
}

function exportPdf() {
    const content = preview.innerHTML;
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    pdf.html(content, {
        callback: function (pdf) {
            pdf.save('export.pdf');
        },
        x: 10,
        y: 10,
        width: 190, // A4 width is 210mm, leaving 10mm margins on each side
        windowWidth: 800 // Adjust this value to change the scale of the content
    });
}


function toggleExpand() {
    const editorContainer = document.getElementById('editor-container');
    editorContainer.classList.toggle('expanded');
    expandToggle.textContent = editorContainer.classList.contains('expanded') ? 'Reduce Editor' : 'Expand Editor';
}

expandToggle.addEventListener('click', toggleExpand);
editor.addEventListener('input', updatePreview);
darkModeToggle.addEventListener('click', toggleDarkMode);
exportPdfBtn.addEventListener('click', exportPdf);
downloadMdBtn.addEventListener('click', downloadMd);
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

window.addEventListener('load', () => {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
        updatePreview();
    }
    
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
});



// Initial preview
updatePreview();
