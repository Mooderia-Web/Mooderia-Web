const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key) {
    res.status(500).json({ error: 'No GEMINI_API_KEY configured on the server.' });
    return;
  }

  const { model, contents, config } = req.body || {};
  if (!model || !contents) {
    res.status(400).json({ error: 'Missing model or contents in request body.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({ model, contents, config });
    res.status(200).json({ text: response.text });
  } catch (err) {
    // Log and surface a safe error message
    // eslint-disable-next-line no-console
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
};
