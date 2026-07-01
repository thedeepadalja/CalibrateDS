import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CalibrateDS — Your design file is source code.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(182,141,66,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(182,141,66,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Gold glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(182,141,66,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top: logo + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
          {/* Gold accent + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <div
              style={{
                width: '5px',
                height: '32px',
                background: '#B68D42',
                borderRadius: '3px 0 0 3px',
                marginRight: '12px',
                display: 'flex',
              }}
            />
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#F5F0E8', letterSpacing: '-0.02em' }}>
              Calibrate
            </span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#B68D42', letterSpacing: '-0.02em' }}>
              DS
            </span>
          </div>

          {/* Version badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: 'rgba(182,141,66,0.1)',
              border: '1px solid rgba(182,141,66,0.25)',
              borderRadius: '999px',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#B68D42',
                display: 'flex',
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#B68D42', letterSpacing: '0.06em' }}>
              v0.1.65 · MCP-POWERED
            </span>
          </div>
        </div>

        {/* Center: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
          <div style={{ fontSize: '78px', fontWeight: 800, color: '#F5F0E8', lineHeight: 1.05, letterSpacing: '-0.03em', display: 'flex', flexDirection: 'column' }}>
            <span>Your design file is</span>
            <span style={{ color: '#B68D42' }}>source code.</span>
          </div>
          <div style={{ fontSize: '24px', color: '#64748B', lineHeight: 1.5, maxWidth: '720px', display: 'flex' }}>
            Scan Figma · Generate typed React components · Detect design drift in CI
          </div>
        </div>

        {/* Bottom: install snippet + tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#111113',
              border: '1px solid #1e1e22',
              borderRadius: '10px',
              padding: '14px 22px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#B68D42', fontFamily: 'monospace' }}>$</span>
            <span style={{ fontSize: '18px', color: '#94A3B8', fontFamily: 'monospace' }}>
              npm install -g @calibrate-ds/cli
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {['Claude Code', 'Cursor', 'Windsurf'].map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '8px 16px',
                  background: '#111113',
                  border: '1px solid #1e1e22',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#64748B',
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
