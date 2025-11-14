// pages/api/moderation.js

import { RekognitionClient, DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";

// पर्यावरण चर (Environment Variables) से क्रेडेंशियल लोड करें
const client = new RekognitionClient({
  region: process.env.AWS_REGION || "us-east-1", // अपनी AWS रीजन यहां सेट करें
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { image } = req.body;
  
  if (!image) {
    return res.status(400).json({ message: 'No image data provided' });
  }

  try {
    // Base64 इमेज डेटा को एक Buffer में बदलें
    const imageBytes = Buffer.from(image, 'base64');
    
    const command = new DetectModerationLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      MinConfidence: 75, // आप आत्मविश्वास (Confidence) स्तर को एडजस्ट कर सकते हैं
    });

    const response = await client.send(command);
    const moderationLabels = response.ModerationLabels;

    let isExplicit = false;

    // Rekognition से लेबल की जांच
    for (const label of moderationLabels) {
      // Rekognition 'Explicit Nudity' या 'Suggestive' जैसे लेबल लौटाता है।
      // आपको अपनी पॉलिसी के अनुसार लेबल चुनने होंगे।
      if (
        label.Name === 'Explicit Nudity' || 
        label.ParentName === 'Explicit Nudity' ||
        label.Name === 'Sexual Activity'
      ) {
        isExplicit = true;
        break;
      }
    }

    res.status(200).json({ isExplicit, labels: moderationLabels });
  } catch (error) {
    console.error("AWS Rekognition Error:", error);
    res.status(500).json({ message: 'Moderation failed', error: error.message });
  }
}