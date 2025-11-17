# AI Script Generator

A production-ready web application that generates complete, professional scripts from detailed JSON blueprints. This tool transforms structured parameters into flawless, production-ready content following precise narrative structures and embodiment rules.

## Features

- **Video Idea Input**: Optional field to provide context for your script topic
- **JSON-Driven Generation**: Upload or paste JSON blueprints to generate scripts
- **Sequential Section Generation**: Generate one section at a time for maximum control
- **Section-by-Section Workflow**: Review and regenerate individual sections as needed
- **Context Chaining**: Each section builds upon previous sections for coherent narrative flow
- **Archetype Embodiment**: Automatically applies persona, tone, and style rules
- **Multi-Section Support**: Handles complex narrative structures with submomentos
- **Individual Section Control**: Enable/disable regeneration for each section independently
- **Production-Ready Output**: Generates markdown-formatted scripts ready for use
- **Modern UI**: Clean, responsive interface with real-time generation and loading states
- **Export Options**: Copy to clipboard or download as text file (for individual sections or all at once)

## How It Works

### 1. Parse and Internalize
The generator deeply parses your JSON blueprint, internalizing every rule, constraint, and piece of content.

### 2. Embody the Archetype
Before generating content, the system adopts the persona defined by your JSON:
- **Perspective**: First-person speaker addressing second-person audience
- **Relationship**: Mentor to disciple dynamic
- **Authority**: Calm, absolute, unquestionable tone
- **Emotional Tone**: Conversational, reflective, direct
- **Writing Style**: Simple vocabulary with rhetorical devices

### 3. Sequential Generation
The script is generated section by section, following your `estructuraNarrativaDelGuion.secuencias` array:

1. **Section 1 - EL ANCLAJE (El Gancho)**: Uses pre-written script from variantes
2. **Section 2 - EL COSTE**: Quantifies the hidden price
3. **Section 3 - EL GIRO**: Challenges fundamental assumptions
4. **Section 4 - LA VERDAD**: Presents core insights (with submomentos)
5. **Section 5 - LA PRAXIS**: Shows practical application
6. **Section 6 - EL CIERRE**: Leaves audience with clear choice

Each section maintains full awareness of all previously generated content for seamless narrative flow.

### 4. Final Output
The complete script is formatted with markdown headings and ready for production use.

## Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. (Optional) Enter your video idea/topic in the text field
3. Upload a JSON blueprint file or paste JSON directly into the input area
4. Click "Initialize Generation" to validate and show sections
5. Click "Generate Section 1" to create the first section
6. Review the generated content
7. Click "Generate Section 2" to continue (button auto-enables after Section 1)
8. Repeat for all 6 sections, or regenerate any section as needed
9. Use "Copy All" or "Download All" to export your complete script

### Using a Local Server (Recommended)

For the best experience, run the app with a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Sequential Generation Workflow

The app uses a step-by-step workflow that gives you complete control over each section:

### Configuration Phase
1. **Enter Video Idea** (optional): Provide context about your video topic
2. **Load JSON Blueprint**: Upload or paste your JSON configuration
3. **Initialize**: Click "Initialize Generation" to validate inputs and prepare sections

### Generation Phase
The 6 sections appear in separate boxes. Each section:
- **Starts Disabled**: Only Section 1 is enabled initially
- **Generate on Demand**: Click the generate button to create that section
- **Auto-Enable Next**: After generation, the next section's button becomes active
- **Regenerate Anytime**: Click "Regenerate" to recreate any section with new content
- **Context Aware**: Each section uses all previous sections as context

### Export Phase
- **Copy All**: Copy all generated sections to clipboard
- **Download All**: Download as a text file (includes video idea if provided)
- **Individual Review**: Review and edit each section separately

### Benefits
- **More Control**: Generate only the sections you need
- **Iterative Refinement**: Regenerate sections until satisfied
- **Clear Progress**: Visual feedback shows which sections are complete
- **Auto-Scroll**: Automatically scrolls to the next section when ready

## JSON Blueprint Structure

Your JSON blueprint must include:

### Required Fields

```json
{
  "perfilCanal": {
    "idioma": "English",
    "nicho": "Your niche",
    "audienciaPrincipal": "Your target audience"
  },
  "arquetipoVoz": {
    "perspectiva": {
      "hablante": "first-person",
      "audiencia": "second-person"
    },
    "relacionConAudiencia": "Mentor a discípulo",
    "autoridad": "Calmada, absoluta, incuestionable"
  },
  "tonoEmocional": {
    "tonosBase": ["Conversacional", "Reflexivo", "Directo"],
    "tonosAEvitar": ["Entusiasmo artificial", "Sarcasmo"]
  },
  "estiloDeRedaccion": {
    "estructuraDeFrases": {
      "tipo": "Mezcla de frases cortas/medianas",
      "complejidad": "Simple y directa"
    },
    "vocabulario": {
      "nivel": "Simple y accesible"
    },
    "recursosRhetoricos": ["Antítesis", "Preguntas retóricas"]
  },
  "estructuraNarrativaDelGuion": {
    "secuencias": [
      {
        "nombre": "1. EL ANCLAJE (El Gancho)",
        "objetivo": "Capturar atención",
        "palabrasAproximadas": 150,
        "variantes": [
          {
            "nombre": "VERSIÓN 4B",
            "script": "Your pre-written hook script here..."
          }
        ]
      }
      // ... more sections
    ]
  }
}
```

### Sample Blueprint

See `sample-blueprint.json` for a complete working example.

## Blueprint Sections

### Section 1: EL ANCLAJE (El Gancho)
- Uses pre-written script from `variantes[0].script`
- Can be extended with notes from `notasDeUso`
- Purpose: Capture immediate attention

### Section 2: EL COSTE (La Tesis del Dolor)
- Quantifies hidden costs and prices
- Uses concrete numbers and time metaphors
- Target: ~630 words

### Section 3: EL GIRO
- Challenges fundamental assumptions
- Contrasts belief vs reality
- Target: ~500 words

### Section 4: LA VERDAD
- Presents core insights
- Structured with submomentos:
  - A. La Ilusión (What most believe)
  - B. La Realidad (What actually happens)
  - C. La Llave (The key insight)
- Target: ~700 words

### Section 5: LA PRAXIS
- Shows practical application
- Concrete steps and examples
- Target: ~600 words

### Section 6: EL CIERRE
- Presents clear choice to audience
- Contrasts two paths forward
- Target: ~400 words

## Technical Details

### Files

- `index.html` - Main application interface
- `app.js` - UI controller and event handlers
- `script-generator.js` - Core generation engine
- `styles.css` - Responsive styling
- `sample-blueprint.json` - Example blueprint

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Technologies Used

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 with CSS Grid and Flexbox
- No external dependencies

## Features in Detail

### Context Chaining
Each section is generated with full awareness of all previous sections, ensuring:
- Consistent narrative voice
- Logical progression
- Smooth transitions
- Coherent storytelling

### Embodiment Rules
The generator automatically applies:
- First-person perspective ("I")
- Second-person audience address ("You")
- Mentor-to-disciple relationship dynamics
- Conversational, reflective, direct tone
- Simple vocabulary with rhetorical devices

### Error Handling
- JSON validation before processing
- Clear error messages
- Input sanitization
- Graceful failure recovery

## Usage Tips

1. **Start with the sample**: Use `sample-blueprint.json` as a template
2. **Test incrementally**: Build your blueprint section by section
3. **Validate JSON**: Use a JSON validator before uploading
4. **Iterate**: Refine your blueprint based on generated output
5. **Save blueprints**: Keep successful blueprints for reuse

## Troubleshooting

### "Invalid JSON format" error
- Check for missing commas, brackets, or quotes
- Validate JSON using an online validator
- Ensure all strings are properly escaped

### "Missing required key" error
- Verify all required fields are present
- Check spelling of field names
- Ensure proper nesting of objects

### Script doesn't match expectations
- Review your blueprint parameters
- Check section objectives and techniques
- Verify word counts align with content goals

## Development

### Local Development

```bash
# Clone the repository
git clone <repository-url>

# Navigate to directory
cd Content-Creator

# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Code Structure

```
script-generator.js
├── ScriptGenerator class
│   ├── parseAndInternalize()
│   ├── extractEmbodimentRules()
│   ├── generateSection()
│   ├── generateSection1() - Special handling
│   ├── generateSection2-6() - Sequential generation
│   └── formatOutput()
└── generateScriptFromBlueprint() - Main entry point
```

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

Built with precision for production-ready script generation.
