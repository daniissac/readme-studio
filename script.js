// Core elements
const editor = document.getElementById('editor');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const downloadMdBtn = document.getElementById('download-md');
const exportPdfBtn = document.getElementById('export-pdf');

// Initialize tooltip menu
const tooltipMenu = createTooltipMenu();

// Event Listeners
editor.addEventListener('contextmenu', handleContextMenu);
document.addEventListener('click', () => tooltipMenu.style.display = 'none');
tooltipMenu.addEventListener('click', handleTooltipClick);
darkModeToggle.addEventListener('click', toggleDarkMode);
downloadMdBtn.addEventListener('click', downloadMarkdown);
exportPdfBtn.addEventListener('click', exportToPdf);

// Load saved content and preferences
loadSavedContent();

function createTooltipMenu() {
    const menu = document.createElement('div');
    menu.className = 'tooltip-menu';
    menu.innerHTML = `
        <div class="tooltip-item" data-format="bold">Bold</div>
        <div class="tooltip-item" data-format="italic">Italic</div>
        <div class="tooltip-item" data-format="heading">Heading</div>
        <div class="tooltip-item" data-format="quote">Quote</div>
        <div class="tooltip-item" data-format="code">Code Block</div>
        <div class="tooltip-item" data-format="link">Link</div>
    `;
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
    const format = e.target.dataset.format;
    const formatActions = {
        bold: ['**', '**'],
        italic: ['_', '_'],
        heading: ['# '],
        quote: ['> '],
        code: ['```\n', '\n```'],
        link: ['[', '](url)']
    };
    
    if (formatActions[format]) {
        insertMarkdown(...formatActions[format]);
    }
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
    formatText();
}

function formatText() {
    const text = editor.value;
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    editor.innerHTML = formattedText;
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

function exportToPdf() {
    const content = editor.innerHTML;
    const pdf = new jspdf.jsPDF();
    pdf.html(content, {
        callback: pdf => pdf.save('document.pdf')
    });
}

function loadSavedContent() {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        editor.value = savedContent;
        formatText();
    }
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

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
                exportToPdf();
                break;
        }
    }
});

// Autosave with debouncing
let saveTimeout;
function autoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('markdownContent', editor.value);
        showSaveStatus('Saved');
    }, 1000);
}

function showSaveStatus(message) {
    const status = document.getElementById('save-status');
    status.textContent = message;
    status.style.opacity = 1;
    setTimeout(() => {
        status.style.opacity = 0;
    }, 2000);
}

function updateWordCount() {
    const wordCount = editor.value.trim()
        ? editor.value.trim().split(/\s+/).length
        : 0;
    document.getElementById('word-count').textContent = `${wordCount} words`;
}

editor.addEventListener('input', formatText);
