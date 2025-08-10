export async function POST(request) {
  try {
    const { text, source = 'hi', target = 'en' } = await request.json();

    if (!text) {
      return Response.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Free Google Translate API (no key required)
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Unexpected response type');
    }

    const data = await response.json();

    // Extract translated text
    const translatedText = data[0]?.map(item => item[0]).join('');

    return Response.json({ translated: translatedText });

  } catch (error) {
    console.error('Translation error:', error);
    return Response.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
}