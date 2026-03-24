export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: "あなたはプロのマンガ名刺プロデューサーです。業種と想いから集客に役立つ4コマ漫画案を提案してください。" }]
        },
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
      return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const reason = (data.candidates && data.candidates) ? data.candidates.finishReason : "不明";
    return new Response(JSON.stringify({ text: "AIが回答を控えました。理由: " + reason }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続に失敗しました。もう一度お試しください。" }), { status: 500 });
  }
}
