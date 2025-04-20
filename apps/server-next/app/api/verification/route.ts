import { NextResponse } from 'next/server';
import { authenticate } from '../middleware'; // your JWT/auth middleware
import axios from 'axios';
import FormData from 'form-data';

// Helper: Convert file to Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const step = formData.get('step');

    // ✅ Step 1 - Single image
    if (step === '1') {
      const image = formData.get('image') as File;
      if (!image) {
        return NextResponse.json({ message: 'Missing image file' }, { status: 400 });
      }

      const buffer = await fileToBuffer(image);

      const uploadForm = new FormData();
      uploadForm.append('image', buffer, {
        filename: image.name || 'image.jpg',
        contentType: image.type || 'image/jpeg',
      });

      const response = await axios.post('http://localhost:8005/step1', uploadForm, {
        headers: uploadForm.getHeaders(),
      });

      return NextResponse.json(response.data);
    }

    // ✅ Step 2 - Front & Back images
    if (step === '2') {
      const front = formData.get('front') as File;
      const back = formData.get('back') as File;

      if (!front || !back) {
        return NextResponse.json({ message: 'Missing front or back image' }, { status: 400 });
      }

      const uploadForm = new FormData();
      uploadForm.append('front', await fileToBuffer(front), {
        filename: front.name || 'front.jpg',
        contentType: front.type || 'image/jpeg',
      });
      uploadForm.append('back', await fileToBuffer(back), {
        filename: back.name || 'back.jpg',
        contentType: back.type || 'image/jpeg',
      });

      const response = await axios.post('http://localhost:8005/step2', uploadForm, {
        headers: uploadForm.getHeaders(),
      });

      return NextResponse.json(response.data);
    }

    return NextResponse.json({ message: 'Unsupported step' }, { status: 400 });
  } catch (error: any) {
    console.error('Verification error:', error);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || 'Verification processing failed';

    return NextResponse.json({ message }, { status });
  }
}