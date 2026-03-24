export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // ミカさんの環境で成功が確認された 2.5 Flash を使用
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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

    // エラーがある場合はその理由を返す
    if (data.error) {
      return new Response(JSON.stringify({ text: "Google Error: " + data.error.message }));
    }

    // 回答テキストを確実に抽出（旧式で安全なチェック）
    if (data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts && data.candidates.content.parts) {
      const aiResponseText = data.candidates.content.parts.text;
      return new Response(JSON.stringify({ text: aiResponseText }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // AIが安全上の理由等で回答を空にした場合
    return new Response(JSON.stringify({ text: "AIが回答を控えました。別の表現で試してみてください。" }));

  } catch (e) {
    return new Response(JSON.stringify({ text: "通信に失敗しました。時間をおいてお試しください。" }), { status: 500 });
  }
}
