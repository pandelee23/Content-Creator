# AI Script Generator - Setup Instructions

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open Your Browser
Navigate to: **http://localhost:3000**

That's it! 🎉

---

## What You'll See

```
🚀 AI Script Generator Server
📡 Server running on http://localhost:3000
✅ Ready to generate scripts!
```

---

## How to Use

1. **Get your Claude API Key**
   - Visit https://console.anthropic.com/
   - Create an API key (starts with `sk-ant-`)

2. **Open the App**
   - Go to http://localhost:3000
   - Enter your API key (saved locally)
   - Add your video idea
   - Paste your JSON blueprint

3. **Generate Your Script**
   - Click "Initialize Generation"
   - Generate sections one by one
   - Each section uses Claude AI!

---

## Why a Server?

**Problem**: Browsers block direct API calls to Claude AI (CORS restrictions)

**Solution**: This Node.js server:
- ✅ Proxies requests to Claude AI
- ✅ Handles CORS properly
- ✅ Keeps your API key secure
- ✅ Serves the web app

---

## Troubleshooting

### "Cannot find module 'express'"
Run: `npm install`

### Port 3000 already in use?
Change the port:
```bash
PORT=8080 npm start
```

Then visit: http://localhost:8080

### Server won't start?
Make sure you have Node.js installed:
```bash
node --version
```

Should show v14 or higher. Download from: https://nodejs.org/

---

## Development

### File Structure
```
ai-script-generator/
├── server.js          # Backend proxy server
├── index.html         # Frontend app
├── app.js            # Frontend logic
├── claude-ai.js      # API integration
├── script-generator.js
├── styles.css
├── package.json      # Dependencies
└── SETUP.md         # This file
```

### API Endpoint
```
POST /api/claude
{
  "apiKey": "sk-ant-...",
  "prompt": "Your prompt",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

---

## Production Deployment

### Deploy to Heroku
```bash
git push heroku main
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Railway
```bash
railway up
```

---

## Support

Issues? Check:
1. Node.js is installed (`node --version`)
2. Dependencies are installed (`npm install`)
3. Server is running (`npm start`)
4. API key is valid (starts with `sk-ant-`)

---

**Ready to generate amazing scripts!** 🚀
