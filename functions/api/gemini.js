export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await res.json();

    console.log("Gemini:", data);

    let text = "AIが回答できませんでした";

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    }

    if (data?.error?.message) {
      text = "APIエラー: " + data.error.message;
    }

    return new Response(
      JSON.stringify({ text }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ text: "サーバーエラー" }),
      { status: 500 }
    );
  }
}
