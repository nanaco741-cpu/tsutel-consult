export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
      const aiText = data.candidates.content.parts.text;
      return new Response(JSON.stringify({ text: aiText }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ text: "AIからの応答が空でした。内容を少し変えてお試しください。" }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラーが発生しました。" }), { status: 500 });
  }
}
