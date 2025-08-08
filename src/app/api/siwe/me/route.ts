import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth')?.value

    if (!token) {
      return Response.json({ error: 'Not authenticated' }, { 
        status: 401,
        headers: corsHeaders 
      })
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    if (!payload.sub) {
      return Response.json({ error: 'Invalid token' }, { 
        status: 401,
        headers: corsHeaders
      })
    }

    return Response.json({ 
      address: payload.sub,
      authenticated: true,
      issuedAt: payload.iat,
      expiresAt: payload.exp
    }, {
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Auth verification error:', error)
    return Response.json({ error: 'Authentication failed' }, { 
      status: 401,
      headers: corsHeaders
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  })
}