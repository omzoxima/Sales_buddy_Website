import { NextRequest, NextResponse } from 'next/server'

/**
 * =============================================================================
 * CONTACT FORM API ROUTE
 * =============================================================================
 * 
 * General contact form handler.
 * 
 * =============================================================================
 */

interface ContactRequest {
  name: string
  email: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    console.log('Contact form submission:', { name, email, message })

    // TODO: Send email notification
    // TODO: Store in CRM
    // TODO: Slack notification

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
