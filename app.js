/**
 * Main Application Controller
 * Handles UI interactions and orchestrates sequential section generation
 */

// DOM Elements
const videoIdeaInput = document.getElementById('videoIdea');
const jsonInput = document.getElementById('jsonInput');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const initializeBtn = document.getElementById('initializeBtn');
const clearBtn = document.getElementById('clearBtn');
const errorMessage = document.getElementById('errorMessage');
const sectionsContainer = document.getElementById('sectionsContainer');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// State
let blueprint = null;
let videoIdea = '';
let scriptGenerator = null;
let generatedSections = {};

/**
 * Initialize event listeners
 */
function init() {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    initializeBtn.addEventListener('click', handleInitialize);
    clearBtn.addEventListener('click', handleClear);
    copyAllBtn.addEventListener('click', handleCopyAll);
    downloadAllBtn.addEventListener('click', handleDownloadAll);

    // Auto-resize textarea
    jsonInput.addEventListener('input', autoResize);

    // Add event listeners to all generate buttons
    const generateBtns = document.querySelectorAll('.btn-generate');
    generateBtns.forEach(btn => {
        btn.addEventListener('click', handleGenerateSection);
    });
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
 * Handle initialize - validate inputs and show sections
 */
function handleInitialize() {
    hideError();

    // Get video idea
    videoIdea = videoIdeaInput.value.trim();

    // Get JSON
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        showError('Please provide a JSON blueprint');
        return;
    }

    // Validate JSON
    try {
        blueprint = JSON.parse(inputText);
    } catch (e) {
        showError('Invalid JSON format. Please check your syntax.');
        return;
    }

    // Validate required fields
    const requiredKeys = ['perfilCanal', 'arquetipoVoz', 'tonoEmocional', 'estiloDeRedaccion', 'estructuraNarrativaDelGuion'];

    for (const key of requiredKeys) {
        if (!blueprint[key]) {
            showError(`Missing required field: ${key}`);
            return;
        }
    }

    // Create script generator instance
    try {
        scriptGenerator = new ScriptGenerator(blueprint, videoIdea);
        scriptGenerator.parseAndInternalize();
        scriptGenerator.embodimentRules = scriptGenerator.extractEmbodimentRules();
    } catch (error) {
        showError('Failed to initialize generator: ' + error.message);
        return;
    }

    // Reset state
    generatedSections = {};

    // Clear all section contents
    for (let i = 1; i <= 6; i++) {
        const content = document.getElementById(`section${i}Content`);
        content.innerHTML = '';
    }

    // Reset all buttons
    const generateBtns = document.querySelectorAll('.btn-generate');
    generateBtns.forEach(btn => {
        btn.disabled = true;
        const sectionNum = btn.getAttribute('data-section');
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L13 8L8 13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Generate Section ${sectionNum}
        `;
    });

    // Enable first section button
    const firstBtn = document.querySelector('.btn-generate[data-section="1"]');
    firstBtn.disabled = false;

    // Show sections container
    sectionsContainer.style.display = 'block';

    // Scroll to sections
    sectionsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    hideError();
}

/**
 * Handle generate section
 */
async function handleGenerateSection(event) {
    const btn = event.currentTarget;
    const sectionNum = parseInt(btn.getAttribute('data-section'));

    if (!scriptGenerator) {
        showError('Please initialize the generator first');
        return;
    }

    // Disable button and show loading
    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="spinning">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
            <path d="M8 2C4.68629 2 2 4.68629 2 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Generating...
    `;

    const contentDiv = document.getElementById(`section${sectionNum}Content`);
    contentDiv.innerHTML = '<div class="loading">Generating section...</div>';

    // Small delay to show loading state
    setTimeout(() => {
        try {
            // Get the section configuration
            const sections = blueprint.estructuraNarrativaDelGuion?.secuencias || [];

            if (sectionNum > sections.length) {
                throw new Error(`Section ${sectionNum} not found in blueprint`);
            }

            const section = sections[sectionNum - 1];

            // Generate the section
            const generatedSection = scriptGenerator.generateSection(section, sectionNum - 1);

            // Store it
            generatedSections[sectionNum] = generatedSection;

            // Render it
            renderSection(contentDiv, generatedSection.content);

            // Update button
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L7 12L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Regenerate Section ${sectionNum}
            `;
            btn.disabled = false;

            // Enable next section button if exists
            if (sectionNum < 6) {
                const nextBtn = document.querySelector(`.btn-generate[data-section="${sectionNum + 1}"]`);
                if (nextBtn) {
                    nextBtn.disabled = false;

                    // Scroll to next section
                    setTimeout(() => {
                        const nextBox = document.querySelector(`.section-box[data-section="${sectionNum + 1}"]`);
                        if (nextBox) {
                            nextBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 300);
                }
            }

            hideError();

        } catch (error) {
            showError(`Failed to generate section ${sectionNum}: ${error.message}`);
            contentDiv.innerHTML = '';
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }, 200);
}

/**
 * Render section content with markdown-style formatting
 */
function renderSection(container, content) {
    let html = content;

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

    container.innerHTML = html;
}

/**
 * Handle clear all
 */
function handleClear() {
    // Reset inputs
    videoIdeaInput.value = '';
    jsonInput.value = '';
    fileName.textContent = '';
    fileInput.value = '';

    // Reset state
    blueprint = null;
    videoIdea = '';
    scriptGenerator = null;
    generatedSections = {};

    // Hide sections
    sectionsContainer.style.display = 'none';

    // Clear all section contents
    for (let i = 1; i <= 6; i++) {
        const content = document.getElementById(`section${i}Content`);
        content.innerHTML = '';
    }

    hideError();
    autoResize();
}

/**
 * Handle copy all sections
 */
async function handleCopyAll() {
    const allContent = getAllGeneratedContent();

    if (!allContent) {
        showError('No sections generated yet');
        return;
    }

    try {
        await navigator.clipboard.writeText(allContent);

        // Show feedback
        const originalText = copyAllBtn.innerHTML;
        copyAllBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!';

        setTimeout(() => {
            copyAllBtn.innerHTML = originalText;
        }, 2000);

    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

/**
 * Handle download all sections
 */
function handleDownloadAll() {
    const allContent = getAllGeneratedContent();

    if (!allContent) {
        showError('No sections generated yet');
        return;
    }

    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Create filename from video idea or timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = videoIdea
        ? `script-${videoIdea.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.txt`
        : `script-${timestamp}.txt`;

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show feedback
    const originalText = downloadAllBtn.innerHTML;
    downloadAllBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Downloaded!';

    setTimeout(() => {
        downloadAllBtn.innerHTML = originalText;
    }, 2000);
}

/**
 * Get all generated content as formatted text
 */
function getAllGeneratedContent() {
    const sections = Object.keys(generatedSections).sort((a, b) => a - b);

    if (sections.length === 0) {
        return null;
    }

    let output = '';

    // Add video idea if present
    if (videoIdea) {
        output += `VIDEO IDEA: ${videoIdea}\n\n`;
        output += '='.repeat(80) + '\n\n';
    }

    for (const sectionNum of sections) {
        const section = generatedSections[sectionNum];
        output += `## ${section.heading}\n\n`;
        output += section.content;
        output += '\n\n';
    }

    return output.trim();
}

/**
 * Auto-resize textarea
 */
function autoResize() {
    jsonInput.style.height = 'auto';
    jsonInput.style.height = Math.min(jsonInput.scrollHeight, 400) + 'px';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
