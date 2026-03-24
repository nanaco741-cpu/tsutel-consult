export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    // キーが読み込めているかまずチェック
    if (!apiKey) {
      return new Response(JSON.stringify({ text: "エラー：Cloudflare側でAPIキーが認識されていません。設定画面を確認してください。" }));
    }

    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();

    // 成功・失敗に関わらず、Googleからの返信をすべて画面に出します
    return new Response(JSON.stringify({ 
      text: "【Googleからの生返信】" + JSON.stringify(data) 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ text: "接続エラー：" + e.message }), { status: 500 });
  }
}
