export async function GET(request) {
  return Response.json({ 
    message: 'Hello from your backend!',
    timestamp: new Date().toISOString(),
    status: 'API is working'
  })
}