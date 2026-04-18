import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { deleteReview, getBookingReview, postReview } from '@/libs/reviews';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.backendToken) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { bookingId, rating, comment } = body;

  if (!bookingId || typeof rating !== 'number' || typeof comment !== 'string') {
    return NextResponse.json({ success: false, message: 'Invalid review payload' }, { status: 400 });
  }

  console.log(await getBookingReview(bookingId, token.backendToken))
  await deleteReview(bookingId, token.backendToken)

  const result = await postReview(bookingId, rating, comment, token.backendToken);
  console.log(result)
  if (!('success' in result) || !result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
