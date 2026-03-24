export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // ミカさんの環境で成功が確認されている Gemini 2.5 Flash を使用
    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // 【超強化ロジック】どんな形式で返ってきても、執念で文字を拾い上げます
    let textResult = "";
    
    if (data.candidates && data.candidates && data.candidates.content && data.candidates.content.parts) {
      textResult = data.candidates.content.parts.text;
    } else if (data.error) {
      // エラーが返ってきた場合は、その内容をそのまま表示
      textResult = "Google API Error: " + data.error.message;
    }

    if (!textResult) {
      // どこにも文字がない場合
      textResult = "AIからの回答が読み取れませんでした。もう一度お試しください。";
    }

    return new Response(JSON.stringify({ text: textResult }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続エラーが発生しました：" + e.message }), { status: 500 });
  }
}
