const express = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.REMOVE_BG_API_KEY;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

app.use(express.static(__dirname));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, removeBgConfigured: Boolean(API_KEY) });
});

app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      error: 'A remoção de fundo ainda não foi configurada. Crie o arquivo .env e informe REMOVE_BG_API_KEY.'
    });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
  }

  try {
    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype || 'application/octet-stream' });
    form.append('image_file', blob, req.file.originalname || 'foto');
    form.append('size', 'auto');
    form.append('format', 'png');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': API_KEY },
      body: form
    });

    if (!response.ok) {
      const text = await response.text();
      let message = `remove.bg retornou ${response.status}.`;
      try {
        const data = JSON.parse(text);
        if (data?.errors?.length) {
          message = data.errors.map(e => e.title || e.detail || 'Erro na remoção de fundo.').join(' ');
        }
      } catch (_) {
        if (text) message += ` ${text.slice(0, 300)}`;
      }
      return res.status(response.status === 402 ? 402 : 502).json({ error: message });
    }

    const output = Buffer.from(await response.arrayBuffer());
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': output.length,
      'Cache-Control': 'no-store'
    });
    return res.send(output);
  } catch (error) {
    console.error('remove-bg error:', error);
    return res.status(500).json({ error: 'Falha ao conectar ao serviço de remoção de fundo.' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'A imagem é muito grande. O limite deste app é 15 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Gerador de Crachás: http://localhost:${PORT}`);
  console.log(`Remove.bg configurado: ${API_KEY ? 'SIM' : 'NÃO — configure o .env'}`);
});
