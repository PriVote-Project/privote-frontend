import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Verify user is authenticated via SIWE
async function verifyAuth(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('auth')
    if (!authCookie?.value) return null
    console.log('authCookie.value', authCookie.value)
    const { payload } = await jwtVerify(authCookie.value, JWT_SECRET)
    console.log('payload', payload.sub)
    return payload.sub as string // user address
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const userAddress = await verifyAuth()
    if (!userAddress) {
      return Response.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders 
      })
    }

    const body = await request.json()
    const { pollId, pollEndDate, signatureSeed } = body

    if (!pollId || !pollEndDate || !signatureSeed) {
      return Response.json({ error: 'Missing required fields' }, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Create poll-specific JWT
    const pollSeedJWT = await new SignJWT({
      sub: userAddress,
      pollId,
      signatureSeed,
      type: 'poll-seed'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(new Date(pollEndDate))
      .sign(JWT_SECRET)

    // Set cookie with poll-specific name
    const cookieName = `poll-seed-${pollId}`
    const cookieStore = await cookies()
    cookieStore.set({
      name: cookieName,
      value: pollSeedJWT,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(pollEndDate)
    })

    return Response.json({ 
      success: true,
      cookieName,
      expiresAt: pollEndDate
    }, {
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error creating seed JWT:', error)
    return Response.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    })
  }
}

// Get existing seed JWT for a poll
export async function GET(request: Request) {
  try {
    const userAddress = await verifyAuth()
    if (!userAddress) {
      return Response.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders 
      })
    }

    const { searchParams } = new URL(request.url)
    const pollId = searchParams.get('pollId')

    if (!pollId) {
      return Response.json({ error: 'Missing pollId' }, { 
        status: 400,
        headers: corsHeaders 
      })
    }

    const cookieStore = await cookies()
    const cookieName = `poll-seed-${pollId}`
    const seedCookie = cookieStore.get(cookieName)

    if (!seedCookie?.value) {
      return Response.json({ exists: false }, {
        headers: corsHeaders
      })
    }

    try {
      // Verify the JWT is still valid
      const { payload } = await jwtVerify(seedCookie.value, JWT_SECRET)
      
      return Response.json({ 
        exists: true,
        signatureSeed: payload.signatureSeed,
        expiresAt: new Date((payload.exp as number) * 1000).toISOString()
      }, {
        headers: corsHeaders
      })
    } catch {
      // JWT expired or invalid, remove cookie
      (await cookies()).delete(cookieName)
      return Response.json({ exists: false }, {
        headers: corsHeaders
      })
    }

  } catch (error) {
    console.error('Error getting seed JWT:', error)
    return Response.json({ error: 'Internal server error' }, { 
      status: 500,
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
