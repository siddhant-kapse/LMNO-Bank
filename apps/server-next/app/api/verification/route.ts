// /apps/server-next/app/api/verification/route.ts
import { NextResponse } from 'next/server';
import { authenticate } from '../middleware'; // your JWT/auth middleware
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: Request) {
  // Authentication
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse form data
    const formData = await req.formData();
    const step = formData.get('step');
    const image = formData.get('image') as File | null;

    if (!image || typeof step !== 'string') {
      return NextResponse.json(
        { message: 'Missing image or step parameter' },
        { status: 400 }
      );
    }

    // Step 1 processing
    if (step === '1') {
      const buffer = Buffer.from(await image.arrayBuffer());
      console.log(`Buffer size: ${buffer.length} bytes`);
      
      const uploadForm = new FormData();

      uploadForm.append('image', buffer, {
        filename: image.name || 'image.jpg',
        contentType: image.type || 'image/jpeg',
      });
      // Log what we're about to send
      console.log('Sending to FastAPI with headers:', uploadForm.getHeaders());

      const fastApiUrl = 'http://localhost:8000/step1';
      console.log(`Posting to: ${fastApiUrl}`);

      // Forward to FastAPI
      const response = await axios.post('http://localhost:8005/step1', uploadForm, {
        headers: {
          ...uploadForm.getHeaders(),
          // Add any additional headers needed by FastAPI
        },
      });

      console.log('FastAPI response:', response.data);

      return NextResponse.json(response.data);
    }

    return NextResponse.json({ message: 'Unsupported step' }, { status: 400 });
  } catch (error: any) {
    console.error('Verification error:', error);
    
    // Improved error handling
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 
                   error.message || 
                   'Verification processing failed';

    return NextResponse.json({ message }, { status });
  }
}