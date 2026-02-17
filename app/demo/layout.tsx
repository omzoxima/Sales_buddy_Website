'use client'

import { useEffect } from 'react'

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Hide the global footer and constrain the page to viewport height
    useEffect(() => {
        // Hide the global footer
        const footer = document.querySelector('footer')
        if (footer) {
            footer.style.display = 'none'
        }
        // Prevent the main tag from growing beyond viewport
        const main = document.querySelector('main')
        if (main) {
            main.style.flex = '0 0 auto'
        }

        return () => {
            // Restore when navigating away from /demo
            if (footer) {
                footer.style.display = ''
            }
            if (main) {
                main.style.flex = ''
            }
        }
    }, [])

    return <>{children}</>
}
