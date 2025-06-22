// nutritionSite/server.js
const express   = require('express');
const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(require('cors')());
app.use(express.static(path.join(__dirname, 'index')));
app.use('/fonts', express.static(path.join(__dirname, 'index/fonts')));

app.post('/api/pdf', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).send('Missing HTML');

    console.log('Puppeteer executablePath():', puppeteer.executablePath());
    console.log('PUPPETEER_CACHE_DIR env:', process.env.PUPPETEER_CACHE_DIR);

    // Auto-detect Chrome/Chromium binary path
    const chromePaths = [
      process.env.CHROME_PATH,
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/headless-shell'
    ].filter(Boolean);

    let executablePath = null;
    for (const p of chromePaths) {
      if (fs.existsSync(p)) {
        executablePath = p;
        break;
      }
    }
    if (!executablePath) {
      throw new Error('Chrome binary not found in any of the expected paths: ' + chromePaths.join(', '));
    }

    const browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page    = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const wrapperHandle = await page.$('.pdf-wrapper') || await page.$('.label');
    if (!wrapperHandle) {
      await browser.close();
      return res.status(400).send('No .pdf-wrapper or .label element found');
    }
    const bbox = await wrapperHandle.boundingBox();

    const pdfBuffer = await page.pdf({
      printBackground: true,
      pageRanges: '1',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      width: `${Math.ceil(bbox.width)}px`,
      height: `${Math.ceil(bbox.height)}px`
    });

    await browser.close();
    res.type('application/pdf').send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Server error generating PDF');
  }
});


app.get('/healthz', (_req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PDF service -> http://localhost:${PORT}/api/pdf`);
});