export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // 安全フィルターを解除し、AIが途中で回答を止めるのを防ぎます
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    // 正常な回答がある場合、テキストのみを抽出
    if (data.candidates && data.candidates && data.candidates.content) {
      return new Response(JSON.stringify({ text: data.candidates.content.parts.text }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 安全フィルターで止まった場合のメッセージ
    if (data.candidates && data.candidates && data.candidates.finishReason === "SAFETY") {
        return new Response(JSON.stringify({ text: "AIが内容を確認中です。表現を少し変えてもう一度お試しください。" }));
    }

    return new Response(JSON.stringify({ text: "診断に失敗しました。もう一度「AI診断」ボタンを押してください。" }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "サーバーエラーが発生しました。" }), { status: 500 });
  }
}
