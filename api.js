// /api/tag.js (Vercel serverless function)
export default async function handler(req, res) {
  const { note } = req.body;

  const prompt = `Assign one emotional or mental tag to the following journal entry:\n"${note}"\nTag:`;

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer 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`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 10,
      temperature: 0.5,
    })
  });

  const data = await response.json();
  const tag = data.choices[0].text.trim();

  res.status(200).json({ tag });
}
