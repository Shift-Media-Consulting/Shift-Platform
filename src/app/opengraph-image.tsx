import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'shift.media — Independent Production Advisory'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#004d40',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: '72px',
          position: 'relative',
        }}
      >
        {/* Top-left: mono label */}
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: '72px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#f6f5f2',
            opacity: 0.5,
            letterSpacing: '0.1em',
          }}
        >
          ● shift.media
        </div>

        {/* Bottom-right accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '72px',
            width: '80px',
            height: '3px',
            background: 'rgba(106,171,156,0.6)',
          }}
        />

        {/* Main headline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 700,
            fontSize: '68px',
            lineHeight: 1,
            letterSpacing: '-2px',
            color: '#f6f5f2',
            marginBottom: '20px',
            whiteSpace: 'pre-line',
          }}
        >
          {`Independent\nProduction Advisory.`}
        </div>

        {/* Sub line */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '22px',
            color: '#f6f5f2',
            opacity: 0.65,
          }}
        >
          On your side. Hamburg, Germany.
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
