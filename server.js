/**
 * Backend Server for Claude AI API Proxy
 * Handles CORS and proxies requests to Anthropic API
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

/**
 * Proxy endpoint for Claude AI API
 * POST /api/claude
 */
app.post('/api/claude', async (req, res) => {
    try {
        const { apiKey, prompt, temperature, maxTokens } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        if (!apiKey.startsWith('sk-ant-')) {
            return res.status(400).json({ error: 'Invalid API key format' });
        }

        // Make request to Claude AI API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: maxTokens || 4096,
                temperature: temperature || 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({
                error: error.error?.message || `API request failed: ${response.status}`
            });
        }

        const data = await response.json();
        res.json({ content: data.content[0].text });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: `Server error: ${error.message}`
        });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 AI Script Generator Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`✅ Ready to generate scripts!\n`);
});
