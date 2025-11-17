/**
 * Main Application Controller
 * Handles UI interactions and orchestrates script generation
 */

// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const output = document.getElementById('output');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentScript = '';

/**
 * Initialize event listeners
 */
function init() {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    generateBtn.addEventListener('click', handleGenerate);
    clearBtn.addEventListener('click', handleClear);
    copyBtn.addEventListener('click', handleCopy);
    downloadBtn.addEventListener('click', handleDownload);

    // Auto-resize textarea
    jsonInput.addEventListener('input', autoResize);
}

/**
 * Handle file upload
 */
function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith('.json')) {
        showError('Please upload a valid JSON file (.json)');
        return;
    }

    fileName.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        jsonInput.value = e.target.result;
        autoResize();
        hideError();
    };
    reader.onerror = () => {
        showError('Failed to read file');
    };
    reader.readAsText(file);
}

/**
 * Handle script generation
 */
function handleGenerate() {
    hideError();

    const inputText = jsonInput.value.trim();

    if (!inputText) {
        showError('Please provide a JSON blueprint');
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    output.innerHTML = '<div class="loading">Generating your script...</div>';

    // Small delay to show loading state
    setTimeout(() => {
        try {
            // Validate JSON first
            let blueprint;
            try {
                blueprint = JSON.parse(inputText);
            } catch (e) {
                throw new Error('Invalid JSON format. Please check your syntax.');
            }

            // Generate script
            const result = generateScriptFromBlueprint(inputText);

            if (!result.success) {
                throw new Error(result.error);
            }

            currentScript = result.script;

            // Render the script with markdown formatting
            renderScript(currentScript);

            // Scroll to output
            output.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            showError(error.message);
            output.innerHTML = '';
            currentScript = '';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Script';
        }
    }, 100);
}

/**
 * Render script with markdown-style formatting
 */
function renderScript(script) {
    // Convert markdown to HTML
    let html = script;

    // Headers
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
        if (para.startsWith('<h')) return para;
        if (para.trim() === '') return '';
        return `<p>${para}</p>`;
    }).join('\n');

    output.innerHTML = html;
}

/**
 * Handle clear button
 */
function handleClear() {
    jsonInput.value = '';
    output.innerHTML = '';
    fileName.textContent = '';
    fileInput.value = '';
    currentScript = '';
    hideError();
    autoResize();
}

/**
 * Handle copy to clipboard
 */
async function handleCopy() {
    if (!currentScript) {
        showError('No script to copy');
        return;
    }

    try {
        await navigator.clipboard.writeText(currentScript);

        // Show feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!';

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);

    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

/**
 * Handle download as text file
 */
function handleDownload() {
    if (!currentScript) {
        showError('No script to download');
        return;
    }

    const blob = new Blob([currentScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-script-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show feedback
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Downloaded!';

    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
    }, 2000);
}

/**
 * Auto-resize textarea
 */
function autoResize() {
    jsonInput.style.height = 'auto';
    jsonInput.style.height = jsonInput.scrollHeight + 'px';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
