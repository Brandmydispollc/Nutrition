// nutritionSite/server.js
const express   = require('express');
const puppeteer = require('puppeteer');
const path      = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(require('cors')());                         // dev convenience
app.use(express.static(path.join(__dirname, 'index')));

// make the WOFF2 files reachable when Puppeteer renders the HTML
app.use('/fonts', express.static(path.join(__dirname, 'index/fonts')));

app.post('/api/pdf', async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).send('Missing HTML');

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page    = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Measure the label’s rendered dimensions
  const wrapperHandle = await page.$('.pdf-wrapper');
  const bbox          = await wrapperHandle.boundingBox();

  const pdfBuffer = await page.pdf({
    printBackground: true,
    pageRanges: '1',
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    width: `${Math.ceil(bbox.width)}px`,
    height: `${Math.ceil(bbox.height)}px`
  });

  await browser.close();
  res.type('application/pdf').send(pdfBuffer);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`PDF service -> http://localhost:${PORT}/api/pdf`);
});
