import { NextRequest } from 'next/server'
import { Porto, ServerActions } from 'porto'
import { ServerClient } from 'porto/viem'
import { hashMessage } from 'viem'
import { parseSiweMessage } from 'viem/siwe'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, signature } = body
    
    // Log signature details for inspection
    console.log('=== SIWE SIGNATURE DEBUG ===')
    console.log('Signature length:', signature?.length || 'undefined')
    console.log('Full signature:', signature)
    console.log('Message length:', message?.length || 'undefined')
    console.log('Message:', message)
    console.log('=== END SIGNATURE DEBUG ===')
    
    if (!message || !signature) {
      return Response.json({ error: 'Missing message or signature' }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Parse the SIWE message
    const { address, chainId, nonce } = parseSiweMessage(message)
    
    if (!address || !chainId) {
      return Response.json({ error: 'Invalid SIWE message' }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Create Porto client and verify signature
    const porto = Porto.create()
    const client = ServerClient.fromPorto(porto, { chainId })
    
    const valid = await ServerActions.verifySignature(client, {
      address,
      digest: hashMessage(message),
      signature,
    })

    if (!valid) {
      return Response.json({ error: 'Invalid signature' }, { 
        status: 401,
        headers: corsHeaders
      })
    }

    // Create JWT token
    const token = await new SignJWT({ sub: address })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return Response.json({ message: 'Authenticated', address }, {
      headers: corsHeaders
    })
  } catch (error) {
    console.error('SIWE verification error:', error)
    return Response.json({ error: 'Authentication failed' }, { 
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