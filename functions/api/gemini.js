export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "エラー：APIキーが未設定です。" }), { status: 500 });
    }

    // URLを v1 から v1beta に変更しました
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates && data.candidates.content) {
        return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
            headers: { "Content-Type": "application/json" }
        });
    } 
    
    return new Response(JSON.stringify({ text: "AIからの応答が空でした。内容を少し変えてみてください。" }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラーが発生しました。" }), { status: 500 });
  }
}
