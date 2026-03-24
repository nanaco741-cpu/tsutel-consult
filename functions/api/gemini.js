export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // 先ほどの生データから、物語のテキストだけを確実に抜き出します
    if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts) {
      const aiStory = data.candidates.content.parts.text;
      return new Response(JSON.stringify({ text: aiStory }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ text: "AIが物語を構成できませんでした。もう一度お試しください。" }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続エラーが発生しました。" }), { status: 500 });
  }
}
