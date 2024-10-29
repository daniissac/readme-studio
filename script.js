// Core elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const downloadMdBtn = document.getElementById('download-md');
const exportPdfBtn = document.getElementById('export-pdf');

// Initialize tooltip menu
const tooltipMenu = createTooltipMenu();

// Configure Marked options
marked.setOptions({
    headerIds: false,
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: true,
    xhtml: true
});

// Event Listeners
editor.addEventListener('input', updatePreview);
editor.addEventListener('contextmenu', handleContextMenu);
document.addEventListener('click', () => tooltipMenu.style.display = 'none');
tooltipMenu.addEventListener('click', handleTooltipClick);
darkModeToggle.addEventListener('click', toggleDarkMode);
downloadMdBtn.addEventListener('click', downloadMarkdown);
exportPdfBtn.addEventListener('click', () => {
    const previewContent = document.getElementById('preview');
    const options = {
        margin: 1,
        filename: 'document.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(previewContent).save();
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                insertMarkdown('**', '**');
                break;
            case 'i':
                e.preventDefault();
                insertMarkdown('_', '_');
                break;
            case 's':
                e.preventDefault();
                downloadMarkdown();
                break;
            case 'p':
                e.preventDefault();
                const previewContent = document.getElementById('preview');
                const options = {
                    margin: 1,
                    filename: 'document.pdf',
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().set(options).from(previewContent).save();
                break;
        }
    }
});

// Load saved content
loadSavedContent();

function createTooltipMenu() {
    const menu = document.createElement('div');
    menu.className = 'tooltip-menu';
    menu.innerHTML = `<div class="tooltip-item" data-format="bold"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2h4.5a3.5 3.5 0 0 1 0 7H4V2zm0 7h5.5a3.5 3.5 0 0 1 0 7H4V9z"/></svg></div><div class="tooltip-item" data-format="italic"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 2l4 12H8l-4-12h2z"/></svg></div><div class="tooltip-item" data-format="heading"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 3h2v10H2V3zm10 0h2v10h-2V3zM6 3h4v2H6V3zm0 4h4v2H6V7zm0 4h4v2H6v-2z"/></svg></div><div class="tooltip-item" data-format="quote"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 6.5a2.5 2.5 0 1 1 5 0v1a6 6 0 0 1-5 5.94V11.5a4 4 0 0 0 3-3.87v-.13H3V6.5zm8 0a2.5 2.5 0 1 1 5 0v1a6 6 0 0 1-5 5.94V11.5a4 4 0 0 0 3-3.87v-.13h-3V6.5z"/></svg></div><div class="tooltip-item" data-format="code"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/></svg></div><div class="tooltip-item" data-format="link"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/></svg></div>`;
    document.body.appendChild(menu);
    return menu;
}

function handleContextMenu(e) {
    e.preventDefault();
    tooltipMenu.style.display = 'block';
    tooltipMenu.style.left = `${e.pageX}px`;
    tooltipMenu.style.top = `${e.pageY}px`;
}

function handleTooltipClick(e) {
    const tooltipItem = e.target.closest('.tooltip-item');
    if (!tooltipItem) return;
    
    const format = tooltipItem.dataset.format;
    const formatActions = {
        bold: ['**', '**'],
        italic: ['_', '_'],
        heading: ['# '],
        quote: ['> '],
        code: ['\n', '\n'],
        link: ['[', '](url)']
    };
    
    if (formatActions[format]) {
        insertMarkdown(...formatActions[format]);
    }
    
    tooltipMenu.style.display = 'none';
}
function insertMarkdown(prefix, suffix = '') {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    const selection = text.substring(start, end);
    
    const newText = text.substring(0, start) + 
                   prefix + selection + suffix + 
                   text.substring(end);
    
    editor.value = newText;
    editor.selectionStart = editor.selectionEnd = start + prefix.length + selection.length + suffix.length;
    editor.focus();
    updatePreview();
}

function updatePreview() {
    preview.innerHTML = marked.parse(editor.value);
    updateWordCount();
    autoSave();
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

function updateWordCount() {
    const text = editor.value
        .trim()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ');
    
    const wordCount = text ? text.split(/\s+/).length : 0;
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
