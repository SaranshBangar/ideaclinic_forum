import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});
 
export async function POST(request: NextRequest) {
  const requestUrl  = new URL(request.url);
  const publicId = requestUrl.searchParams.get('publicId')
  if (!publicId) {
    return NextResponse.error();
  }

  try { 
    await cloudinary.uploader.destroy(publicId);
    
  } catch (error) {
    console.error(error);
    throw error;
  }
  return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 })
}