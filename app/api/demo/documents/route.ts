import { NextRequest, NextResponse } from 'next/server'

/**
 * =============================================================================
 * DEMO DOCUMENTS API ROUTE
 * =============================================================================
 * 
 * Fetches documents from SharePoint via Microsoft Graph API.
 * Uses client credentials flow for authentication.
 * 
 * Environment variables required:
 *   - GRAPH_TENANT_ID
 *   - GRAPH_CLIENT_ID
 *   - GRAPH_CLIENT_SECRET
 *   - SHAREPOINT_SITE_ID
 *   - SHAREPOINT_DRIVE_ID
 * 
 * =============================================================================
 */

interface GraphDriveItem {
    id: string
    name: string
    description?: string
    webUrl: string
    size: number
    file?: {
        mimeType: string
    }
    folder?: {
        childCount: number
    }
    lastModifiedDateTime: string
    '@microsoft.graph.downloadUrl'?: string
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'file'
}

// Cache token in memory to avoid requesting a new one for every API call
let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
    // Return cached token if it's still valid (with 5 min buffer)
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
        const errorData = await tokenResponse.text()
        console.error('Token request failed:', errorData)
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
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
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

        // Get access token
        const accessToken = await getAccessToken()

        // Fetch files from SharePoint drive root
        const graphResponse = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root/children`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!graphResponse.ok) {
            const errorData = await graphResponse.text()
            console.error('Graph API error:', errorData)
            throw new Error('Failed to fetch documents from SharePoint')
        }

        const graphData = await graphResponse.json()
        const items: GraphDriveItem[] = graphData.value || []

        // Filter to only files (exclude folders) and map to our format
        const documents = items
            .filter((item) => item.file) // Only files, not folders
            .map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description || '',
                previewUrl: item.webUrl,
                downloadUrl: item['@microsoft.graph.downloadUrl'] || '',
                type: getFileExtension(item.name),
                size: formatFileSize(item.size),
                mimeType: item.file?.mimeType || '',
                lastModified: item.lastModifiedDateTime,
            }))

        return NextResponse.json({
            success: true,
            documents,
        })
    } catch (error) {
        console.error('Documents API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch documents. Please try again later.' },
            { status: 500 }
        )
    }
}
