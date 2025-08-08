import { generateSiweNonce } from 'viem/siwe'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function POST() {
  try {
    const nonce = generateSiweNonce()
    // const nonce = '6e21dc4ea5d94bf278846c723ae066b6e0e065caf8973073fedd6b580035fae9e21cd9015aa68afe06cb322e592197ad'
    return Response.json({ nonce }, {
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Error generating nonce:', error)
    return Response.json({ error: 'Failed to generate nonce' }, { 
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