// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { imageBase64 } = await req.json();

//   // Base64 → binary Blob conversion
//   const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
//   const buffer = Buffer.from(base64Data, "base64");

//   const formData = new FormData();
//   formData.append("models", "nudity-2.0");
//   // 👇 VERY IMPORTANT: use 'media' as field name + proper Blob/File type
//   formData.append("media", new Blob([buffer], { type: "image/jpeg" }), "frame.jpg");

//   const res = await fetch(
//     "https://api.sightengine.com/1.0/check.json?api_user=1277400605&api_secret=gXAme5h8DwfcRnzwbrwMMiLJxFStdr6E",
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const data = await res.json();
// //   console.log('data', data);
//   return NextResponse.json(data);
// }
// pages/api/moderation.js

// app/api/moderate/route.js
import { NextResponse } from 'next/server';
import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';

export async function POST(request) {
  try {
    const body = await request.json();
    const { image } = body; // expecting dataURL like "data:image/jpeg;base64,...."
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // strip prefix
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const bytes = Buffer.from(base64, 'base64');

    const client = new RekognitionClient({
      region: process.env.AWS_REGION
      // Credentials come from env (NEXT_PUBLIC not needed) or IAM role if deployed.
    });

    const cmd = new DetectModerationLabelsCommand({
      Image: { Bytes: bytes },
      MinConfidence: 60 // tweak as necessary
    });

    const res = await client.send(cmd);

    const labels = res?.ModerationLabels ?? [];

    // Very simple heuristic: if any label name or parent contains "nudity" / "sexual" / "explicit"
    const nudityDetected = labels.some(l =>
      /(nudit|sexual|explicit|sex)/i.test(`${l.Name} ${l.ParentName || ''}`)
    );

    return NextResponse.json({
      nudity: !!nudityDetected,
      confidence: labels.map(l => ({ Name: l.Name, Confidence: l.Confidence, ParentName: l.ParentName })),
      rawLabels: labels
    });
  } catch (err) {
    console.error('Moderation API error:', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
