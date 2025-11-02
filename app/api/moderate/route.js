import { NextResponse } from "next/server";

export async function POST(req) {
  const { imageBase64 } = await req.json();

  // Base64 → binary Blob conversion
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const formData = new FormData();
  formData.append("models", "nudity-2.0");
  // 👇 VERY IMPORTANT: use 'media' as field name + proper Blob/File type
  formData.append("media", new Blob([buffer], { type: "image/jpeg" }), "frame.jpg");

  const res = await fetch(
    "https://api.sightengine.com/1.0/check.json?api_user=1277400605&api_secret=gXAme5h8DwfcRnzwbrwMMiLJxFStdr6E",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
//   console.log('data', data);
  return NextResponse.json(data);
}
