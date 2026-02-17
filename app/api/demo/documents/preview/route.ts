import { NextRequest, NextResponse } from 'next/server'

/**
 * =============================================================================
 * DOCUMENT PREVIEW PROXY
 * =============================================================================
 * 
 * Proxies SharePoint document content and serves it with inline headers
 * so the PDF renders in an iframe instead of triggering a download.
 * 
 * Usage: /api/demo/documents/preview?id=DOCUMENT_ID&email=USER_EMAIL
 * 
 * =============================================================================
 */

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt - 300000) {
        return cachedToken.token
    }

    const tenantId = process.env.GRAPH_TENANT_ID
    const clientId = process.env.GRAPH_CLIENT_ID
    const clientSecret = process.env.GRAPH_CLIENT_SECRET

    if (!tenantId || !clientId || !clientSecret) {
        throw new Error('Missing Graph API environment variables')
    }

    const tokenResponse = await fetch(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                scope: 'https://graph.microsoft.com/.default',
                grant_type: 'client_credentials',
            }),
        }
    )

    if (!tokenResponse.ok) {
        throw new Error('Failed to obtain access token')
    }

    const tokenData = await tokenResponse.json()
    cachedToken = {
        token: tokenData.access_token,
        expiresAt: Date.now() + tokenData.expires_in * 1000,
    }

    return cachedToken.token
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const documentId = searchParams.get('id')
        const email = searchParams.get('email')

        if (!documentId || !email) {
            return NextResponse.json(
                { error: 'Document ID and email are required' },
                { status: 400 }
            )
        }

        const siteId = process.env.SHAREPOINT_SITE_ID
        const driveId = process.env.SHAREPOINT_DRIVE_ID

        if (!siteId || !driveId) {
            return NextResponse.json(
                { error: 'SharePoint configuration missing' },
                { status: 500 }
            )
        }

        const accessToken = await getAccessToken()

        // Fetch the file content from SharePoint
        const contentResponse = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${documentId}/content`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        if (!contentResponse.ok) {
            console.error('Failed to fetch document content:', contentResponse.status)
            return NextResponse.json(
                { error: 'Failed to fetch document' },
                { status: 500 }
            )
        }

        // Get the file bytes
        const fileBuffer = await contentResponse.arrayBuffer()

        // Serve with inline Content-Disposition so it renders in the browser
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'private, max-age=3600',
            },
        })
    } catch (error) {
        console.error('Document preview error:', error)
        return NextResponse.json(
            { error: 'Failed to load document preview' },
            { status: 500 }
        )
    }
}
