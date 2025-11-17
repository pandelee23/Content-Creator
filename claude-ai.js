/**
 * Claude AI API Integration
 * Handles communication with Claude AI API for script generation
 */

class ClaudeAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        // Use local proxy endpoint instead of direct API
        this.baseURL = '/api/claude';
        this.model = 'claude-3-5-sonnet-20241022'; // Claude 3.5 Sonnet (latest)
        this.maxTokens = 4096;
    }

    /**
     * Generate content using Claude AI via proxy
     */
    async generateContent(prompt, temperature = 0.7) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: this.apiKey,
                    prompt: prompt,
                    temperature: temperature,
                    maxTokens: this.maxTokens
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.content;

        } catch (error) {
            throw new Error(`Claude AI Error: ${error.message}`);
        }
    }

    /**
     * Build a comprehensive prompt for section generation
     */
    buildSectionPrompt(blueprint, videoIdea, section, sectionNumber, previousContent) {
        const arquetipo = blueprint.arquetipoVoz || {};
        const tono = blueprint.tonoEmocional || {};
        const estilo = blueprint.estiloDeRedaccion || {};

        let prompt = `You are a professional script writer. Generate a script section based on the following specifications:\n\n`;

        // Video context
        if (videoIdea) {
            prompt += `VIDEO TOPIC: ${videoIdea}\n\n`;
        }

        // Section details
        prompt += `SECTION: ${section.nombre || `Section ${sectionNumber}`}\n`;
        prompt += `OBJECTIVE: ${section.objetivo || 'Continue the narrative'}\n`;

        if (section.palabrasAproximadas) {
            prompt += `TARGET LENGTH: Approximately ${section.palabrasAproximadas} words\n`;
        }

        if (section.tecnicasNarrativas && section.tecnicasNarrativas.length > 0) {
            prompt += `NARRATIVE TECHNIQUES: ${section.tecnicasNarrativas.join(', ')}\n`;
        }

        prompt += `\n`;

        // Voice archetype
        prompt += `VOICE ARCHETYPE:\n`;
        prompt += `- Perspective: Speak in ${arquetipo.perspectiva?.hablante || 'first-person'}, address audience in ${arquetipo.perspectiva?.audiencia || 'second-person'}\n`;
        prompt += `- Relationship: ${arquetipo.relacionConAudiencia || 'Mentor to disciple'}\n`;
        prompt += `- Authority: ${arquetipo.autoridad || 'Calm, absolute, unquestionable'}\n\n`;

        // Emotional tone
        if (tono.tonosBase && tono.tonosBase.length > 0) {
            prompt += `EMOTIONAL TONE (use these): ${tono.tonosBase.join(', ')}\n`;
        }
        if (tono.tonosAEvitar && tono.tonosAEvitar.length > 0) {
            prompt += `AVOID THESE TONES: ${tono.tonosAEvitar.join(', ')}\n`;
        }
        prompt += `\n`;

        // Writing style
        prompt += `WRITING STYLE:\n`;
        if (estilo.estructuraDeFrases) {
            prompt += `- Sentence Structure: ${JSON.stringify(estilo.estructuraDeFrases)}\n`;
        }
        if (estilo.vocabulario) {
            prompt += `- Vocabulary: ${JSON.stringify(estilo.vocabulario)}\n`;
        }
        if (estilo.recursosRhetoricos && estilo.recursosRhetoricos.length > 0) {
            prompt += `- Rhetorical Devices: ${estilo.recursosRhetoricos.join(', ')}\n`;
        }
        prompt += `\n`;

        // Previous context for continuity
        if (previousContent) {
            prompt += `PREVIOUS SECTIONS (for context and continuity):\n`;
            prompt += `${previousContent}\n\n`;
            prompt += `Build naturally on this content. Maintain narrative flow and coherence.\n\n`;
        }

        // Special instructions for specific sections
        if (sectionNumber === 1) {
            prompt += `SPECIAL INSTRUCTIONS FOR SECTION 1 (THE HOOK):\n`;
            prompt += `- Start with immediate impact\n`;
            prompt += `- Create pattern interrupt\n`;
            prompt += `- Address the viewer's current situation\n`;
            prompt += `- Set up the problem/opportunity\n\n`;
        } else if (sectionNumber === 4 && section.submomentos) {
            prompt += `SPECIAL INSTRUCTIONS FOR SECTION 4:\n`;
            prompt += `This section has submomentos that should flow naturally:\n`;
            section.submomentos.forEach((sub, idx) => {
                prompt += `  ${idx + 1}. ${sub.nombre}: ${sub.objetivo}\n`;
            });
            prompt += `Write as one continuous narrative that covers all three submomentos.\n\n`;
        }

        // Transition notes
        if (section.transicion) {
            prompt += `TRANSITION TO NEXT SECTION: ${section.transicion}\n\n`;
        }

        // Final instructions
        prompt += `IMPORTANT:\n`;
        prompt += `- Write ONLY the script content, no meta-commentary\n`;
        prompt += `- Do NOT include section headings or numbers\n`;
        prompt += `- Use natural paragraph breaks\n`;
        prompt += `- Maintain the specified voice, tone, and style throughout\n`;
        prompt += `- The script should feel like it's coming from a real person speaking to the viewer\n`;
        prompt += `- Keep the language in English\n\n`;

        prompt += `Generate the script section now:`;

        return prompt;
    }

    /**
     * Generate a specific section with Claude AI
     */
    async generateSection(blueprint, videoIdea, section, sectionNumber, previousContent) {
        // Check if section has pre-written script (Section 1 special case)
        if (sectionNumber === 1 && section.variantes && section.variantes.length > 0 && section.variantes[0].script) {
            // Use pre-written script
            let script = section.variantes[0].script;

            // Check for extensions
            const notasDeUso = section.notasDeUso || '';
            if (notasDeUso.includes('Extender el gancho') || notasDeUso.includes('NOTAS ADICIONALES')) {
                const extensionMatch = notasDeUso.match(/Extender el gancho[:\s]+([^]*?)(?=\n\n|\n(?=[A-Z])|$)/i);
                if (extensionMatch) {
                    script += '\n\n' + extensionMatch[1].trim();
                }
            }

            return script.trim();
        }

        // Generate with AI
        const prompt = this.buildSectionPrompt(blueprint, videoIdea, section, sectionNumber, previousContent);
        const content = await this.generateContent(prompt, 0.7);

        return content.trim();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClaudeAI };
}
