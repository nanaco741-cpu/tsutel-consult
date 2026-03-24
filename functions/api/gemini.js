export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // 2026年3月現在、最も安定しているエンドポイントです
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // --- 最強の抽出ロジック（ここを強化しました） ---
    let aiText = "";
    
    // パターン1: 標準的な構造
    if (data && data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts) {
      aiText = data.candidates.content.parts.text;
    } 
    // パターン2: 予期せぬエラーが混じっている場合
    else if (data && data.error) {
      aiText = "Google Error: " + data.error.message;
    }
    // パターン3: 安全フィルター等で空の場合
    else {
      aiText = "AIが回答を準備できませんでした。もう一度ボタンを押してみてください。";
    }

    return new Response(JSON.stringify({ text: aiText }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続エラーが発生しました。時間をおいてお試しください。" }), { status: 500 });
  }
}
