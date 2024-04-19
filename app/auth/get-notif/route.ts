import { NextResponse } from 'next/server'
import { Novu } from '@novu/node'

const novu = new Novu(process.env.NOVU_API_KEY || '');

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const id = String(formData.get('id'))
  const firstName = String(formData.get('firstName'))
  const lastName = String(formData.get('lastName'))
  const title = String(formData.get('title'))

    await novu.subscribers.identify(id, { email: email, firstName: firstName, lastName: lastName, data: { 'title' : title }});

return NextResponse.redirect(`${requestUrl.origin}`, {
    status: 301,
})
}