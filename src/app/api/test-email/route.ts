import { NextResponse } from 'next/server';
import { testEmailSetup } from '@/app/admin/resume/actions';

export async function GET() {
  const result = await testEmailSetup();
  return NextResponse.json(result);
}