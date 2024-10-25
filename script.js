const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const downloadMdBtn = document.getElementById('download-md');
const exportPdfBtn = document.getElementById('export-pdf');

marked.setOptions({
    breaks: true,
    gfm: true
});

function updatePreview() {
    const markdown = editor.value;
    const html = marked.parse(markdown);
    preview.innerHTML = html;
    updateWordCount();
    autoSave();
}

function updateWordCount() {
    const wordCount = editor.value.trim() ? editor.value.trim().split(/\s+/).length : 0;
    document.getElementById('word-count').textContent = `${wordCount} words`;
}

function autoSave() {
    localStorage.setItem('markdownContent', editor.value);
    showSaveStatus('Saved');
}

function showSaveStatus(message) {
    const status = document.getElementById('save-status');
    status.textContent = message;
    status.style.opacity = 1;
    setTimeout(() => status.style.opacity = 0, 2000);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function downloadMarkdown() {
    const blob = new Blob([editor.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
}

function loadSavedContent() {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
        updatePreview();
    }
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

editor.addEventListener('input', updatePreview);
darkModeToggle.addEventListener('click', toggleDarkMode);
downloadMdBtn.addEventListener('click', downloadMarkdown);
loadSavedContent();
