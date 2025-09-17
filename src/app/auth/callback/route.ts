import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Auth attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const next = searchParams.get('next') ?? '/'

  if (error) {
    console.error('Supabase auth error:', error, errorDescription);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}`)
  }

  if (code) {
    try {
      console.log('Attempting to exchange auth code...');
      
      const supabase = await createClient()
      
      const { error: exchangeError } = await retryOperation(
        () => supabase.auth.exchangeCodeForSession(code),
        3, 
        1000 
      );
      
      if (!exchangeError) {
        console.log('Auth successful, redirecting to:', next);
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('Code exchange failed after retries:', exchangeError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed`)
      }
      
    } catch (networkError) {
      console.error('Network/connectivity error during auth:', networkError);
      
      if (networkError instanceof Error) {
        if (networkError.message.includes('ECONNRESET') || 
            networkError.message.includes('fetch failed') ||
            networkError.message.includes('ETIMEDOUT')) {
          return NextResponse.redirect(`${origin}/auth/auth-code-error?error=network`)
        }
      }
      
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unknown`)
    }
  }

  console.log('No auth code provided in callback');
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}