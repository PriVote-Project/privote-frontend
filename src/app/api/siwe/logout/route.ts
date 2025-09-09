import { cookies } from 'next/headers';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete the auth cookie
    cookieStore.delete('auth');

    return Response.json(
      { message: 'Logged out successfully' },
      {
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json(
      { error: 'Logout failed' },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
