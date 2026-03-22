import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import './styles.css';

import { renderMarkdown } from './renderer.js';
import { initMermaid, renderMermaidBlocks } from './mermaid-render.js';
import { templates } from './templates.js';
import { generateTOC } from './toc.js';
import { badgePresets, generateBadge } from './badges.js';

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const wordCountEl = document.getElementById('word-count');
const saveStatusEl = document.getElementById('save-status');

const copyMdBtn = document.getElementById('copy-md');
const copyHtmlBtn = document.getElementById('copy-html');
const downloadMdBtn = document.getElementById('download-md');

const templateBtn = document.getElementById('template-btn');
const templateModal = document.getElementById('template-modal');
const templateList = document.getElementById('template-list');

const tocBtn = document.getElementById('toc-btn');

const badgeBtn = document.getElementById('badge-btn');
const badgeModal = document.getElementById('badge-modal');
const badgeCategorySelect = document.getElementById('badge-category');
const badgeBadgeSelect = document.getElementById('badge-badge');
const badgeFieldsContainer = document.getElementById('badge-fields');
const badgeInsertBtn = document.getElementById('badge-insert');
const badgePreviewEl = document.getElementById('badge-preview');

let updateTimeout = null;

editor.addEventListener('input', scheduleUpdate);
darkModeToggle.addEventListener('change', toggleDarkMode);
copyMdBtn.addEventListener('click', copyMarkdown);
copyHtmlBtn.addEventListener('click', copyHTML);
downloadMdBtn.addEventListener('click', downloadMarkdown);
templateBtn.addEventListener('click', () => toggleModal(templateModal));
tocBtn.addEventListener('click', insertTOC);
badgeBtn.addEventListener('click', () => toggleModal(badgeModal));
badgeInsertBtn.addEventListener('click', insertBadge);
badgeCategorySelect.addEventListener('change', onBadgeCategoryChange);
badgeBadgeSelect.addEventListener('change', onBadgeBadgeChange);

document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('active');
  });
});

document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

editor.addEventListener('keydown', handleEditorKeys);
document.addEventListener('keydown', handleGlobalShortcuts);

initTemplateList();
initBadgeSelects();
loadSavedContent();
initMermaid(document.body.classList.contains('dark-mode'));

function scheduleUpdate() {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(updatePreview, 80);
}

async function updatePreview() {
  const html = renderMarkdown(editor.value);
  preview.innerHTML = html;
  await renderMermaidBlocks(preview);
  updateWordCount();
  autoSave();
}

function toggleDarkMode() {
  const isDark = darkModeToggle.checked;
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('darkMode', isDark);
  initMermaid(isDark);
  updatePreview();
}

function copyMarkdown() {
  navigator.clipboard.writeText(editor.value).then(() => showSaveStatus('Copied MD'));
}

function copyHTML() {
  navigator.clipboard.writeText(preview.innerHTML).then(() => showSaveStatus('Copied HTML'));
}

function downloadMarkdown() {
  const blob = new Blob([editor.value], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'README.md';
  a.click();
  URL.revokeObjectURL(url);
}

function insertTOC() {
  const toc = generateTOC(editor.value);
  if (!toc) return;
  insertAtCursor(toc);
}

function insertBadge() {
  const catIdx = badgeCategorySelect.selectedIndex;
  const badgeIdx = badgeBadgeSelect.selectedIndex;
  if (catIdx < 0 || badgeIdx < 0) return;

  const badge = badgePresets[catIdx].badges[badgeIdx];
  const values = {};
  badge.fields.forEach((field) => {
    const input = document.getElementById(`badge-field-${field}`);
    if (input) values[field] = input.value;
  });

  const md = generateBadge(badge, values);
  insertAtCursor(md + '\n');
  badgeModal.classList.remove('active');
}

function insertAtCursor(text) {
  const start = editor.selectionStart;
  const before = editor.value.substring(0, start);
  const after = editor.value.substring(editor.selectionEnd);
  editor.value = before + text + after;
  editor.selectionStart = editor.selectionEnd = start + text.length;
  editor.focus();
  updatePreview();
}

function insertMarkdown(prefix, suffix = '') {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;
  const selection = text.substring(start, end);

  editor.value = text.substring(0, start) + prefix + selection + suffix + text.substring(end);
  editor.selectionStart = editor.selectionEnd = start + prefix.length + selection.length + suffix.length;
  editor.focus();
  updatePreview();
}

function updateWordCount() {
  const text = editor.value.trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
  const count = text ? text.split(/\s+/).length : 0;
  wordCountEl.textContent = `${count} words`;
}

function autoSave() {
  localStorage.setItem('markdownContent', editor.value);
  showSaveStatus('Saved');
}

function showSaveStatus(message) {
  saveStatusEl.textContent = message;
  saveStatusEl.style.opacity = 1;
  setTimeout(() => (saveStatusEl.style.opacity = 0), 2000);
}

function loadSavedContent() {
  const saved = localStorage.getItem('markdownContent');
  if (saved) {
    editor.value = saved;
    updatePreview();
  }

  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }
}

function toggleModal(modal) {
  modal.classList.toggle('active');
}

function initTemplateList() {
  templateList.innerHTML = '';
  templates.forEach((tpl, i) => {
    const item = document.createElement('button');
    item.className = 'template-item';
    item.innerHTML = `<strong>${tpl.name}</strong><span>${tpl.description}</span>`;
    item.addEventListener('click', () => {
      editor.value = tpl.content;
      updatePreview();
      templateModal.classList.remove('active');
    });
    templateList.appendChild(item);
  });
}

function initBadgeSelects() {
  badgeCategorySelect.innerHTML = '';
  badgePresets.forEach((cat, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = cat.category;
    badgeCategorySelect.appendChild(opt);
  });
  onBadgeCategoryChange();
}

function onBadgeCategoryChange() {
  const catIdx = badgeCategorySelect.selectedIndex;
  const cat = badgePresets[catIdx];
  badgeBadgeSelect.innerHTML = '';
  cat.badges.forEach((b, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = b.name;
    badgeBadgeSelect.appendChild(opt);
  });
  onBadgeBadgeChange();
}

function onBadgeBadgeChange() {
  const catIdx = badgeCategorySelect.selectedIndex;
  const badgeIdx = badgeBadgeSelect.selectedIndex;
  if (catIdx < 0 || badgeIdx < 0) return;

  const badge = badgePresets[catIdx].badges[badgeIdx];
  badgeFieldsContainer.innerHTML = '';

  badge.fields.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'badge-field';
    const label = document.createElement('label');
    label.textContent = field;
    label.setAttribute('for', `badge-field-${field}`);
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `badge-field-${field}`;
    input.placeholder = field;
    input.addEventListener('input', updateBadgePreview);
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    badgeFieldsContainer.appendChild(wrapper);
  });

  updateBadgePreview();
}

function updateBadgePreview() {
  const catIdx = badgeCategorySelect.selectedIndex;
  const badgeIdx = badgeBadgeSelect.selectedIndex;
  if (catIdx < 0 || badgeIdx < 0) return;

  const badge = badgePresets[catIdx].badges[badgeIdx];
  const values = {};
  badge.fields.forEach((field) => {
    const input = document.getElementById(`badge-field-${field}`);
    if (input) values[field] = input.value;
  });

  const md = generateBadge(badge, values);
  badgePreviewEl.textContent = md;
}

function handleEditorKeys(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    insertAtCursor('  ');
  }
}

function handleGlobalShortcuts(e) {
  if (!(e.ctrlKey || e.metaKey)) return;

  switch (e.key.toLowerCase()) {
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
  }
}

const toolbar = document.getElementById('toolbar');
if (toolbar) {
  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const actions = {
      bold: () => insertMarkdown('**', '**'),
      italic: () => insertMarkdown('_', '_'),
      strikethrough: () => insertMarkdown('~~', '~~'),
      heading: () => insertMarkdown('## ', ''),
      quote: () => insertMarkdown('> ', ''),
      code: () => insertMarkdown('```\n', '\n```'),
      link: () => insertMarkdown('[', '](url)'),
      image: () => insertMarkdown('![alt](', ')'),
      table: () =>
        insertAtCursor(
          '\n| Header | Header |\n|--------|--------|\n| Cell   | Cell   |\n'
        ),
      hr: () => insertAtCursor('\n---\n'),
      'alert-note': () => insertAtCursor('\n> [!NOTE]\n> Your note here\n'),
      'alert-tip': () => insertAtCursor('\n> [!TIP]\n> Your tip here\n'),
      'alert-important': () => insertAtCursor('\n> [!IMPORTANT]\n> Important info here\n'),
      'alert-warning': () => insertAtCursor('\n> [!WARNING]\n> Warning info here\n'),
      'alert-caution': () => insertAtCursor('\n> [!CAUTION]\n> Caution info here\n'),
      mermaid: () =>
        insertAtCursor(
          '\n```mermaid\ngraph TD\n    A[Start] --> B[End]\n```\n'
        ),
    };

    if (actions[action]) actions[action]();
  });
}

// Alert dropdown toggle
const alertDropdown = document.getElementById('alert-dropdown');
if (alertDropdown) {
  const trigger = alertDropdown.querySelector('.dropdown-trigger');
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    alertDropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => alertDropdown.classList.remove('open'));
}

let scrollSyncing = false;
editor.addEventListener('scroll', () => {
  if (scrollSyncing) return;
  scrollSyncing = true;
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
  preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
  requestAnimationFrame(() => (scrollSyncing = false));
});
