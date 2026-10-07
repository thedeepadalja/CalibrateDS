import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'CalibrateDS: design and code, calibrated.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#0A0A0B';
const PANEL = '#161618';
const BORDER = '#2C2C2E';
const HEADING = '#FFF0D4';
const TEXT = '#A09D96';
const BRAND = '#B68D42';

const CHANNELS = [
  { ch: '01', name: 'PTB', role: 'Compile Figma to typed code' },
  { ch: '02', name: 'DNA', role: 'Hold code to its identity' },
  { ch: '03', name: 'Plugin', role: 'Verify design before handoff' },
];

type FontWeight = 400 | 700 | 800;

/* The site's own faces (Archivo, JetBrains Mono), fetched once at build time.
   If the fetch fails the image still renders with the default face. */
async function loadGoogleFont(family: string, weight: FontWeight) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}`
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return { name: family, data, weight, style: 'normal' as const };
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const [archivo, mono, monoBold, logo] = await Promise.all([
    loadGoogleFont('Archivo', 800),
    loadGoogleFont('JetBrains Mono', 400),
    loadGoogleFont('JetBrains Mono', 700),
    readFile(join(process.cwd(), 'public', 'CalibrateDSLogoSingle.svg'), 'base64'),
  ]);
  const fonts = [archivo, mono, monoBold].filter((f) => f !== null);

  const display = { fontFamily: 'Archivo', fontWeight: 800, letterSpacing: '-0.04em' } as const;
  const word = { ...display, fontSize: 96, lineHeight: 1, color: HEADING, display: 'flex' } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: BG,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px 56px',
          fontFamily: 'JetBrains Mono',
          position: 'relative',
        }}
      >
        {/* Ruler ticks along the top edge, as on the site hero */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 10,
            display: 'flex',
            backgroundImage: `linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
            backgroundSize: '12px 10px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 18,
            display: 'flex',
            backgroundImage: `linear-gradient(90deg, rgba(182,141,66,0.55) 1px, transparent 1px)`,
            backgroundSize: '96px 18px',
          }}
        />
        {/* Brand glow behind the registered word */}
        <div
          style={{
            position: 'absolute',
            left: -260,
            top: -40,
            width: 900,
            height: 900,
            borderRadius: '50%',
            display: 'flex',
            background: 'radial-gradient(circle, rgba(182,141,66,0.16) 0%, transparent 68%)',
          }}
        />

        {/* Register mark: the drifted ring, and the one that landed */}
        <div style={{ position: 'absolute', left: 908, top: 196, width: 220, height: 220, display: 'flex' }}>
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 22,
              width: 168,
              height: 168,
              borderRadius: '50%',
              border: '2px solid rgba(182,141,66,0.3)',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 26,
              top: 26,
              width: 168,
              height: 168,
              borderRadius: '50%',
              border: `2px solid ${HEADING}`,
              display: 'flex',
            }}
          />
          <div style={{ position: 'absolute', left: 0, top: 109, width: 220, height: 2, background: BORDER, display: 'flex' }} />
          <div style={{ position: 'absolute', left: 109, top: 0, width: 2, height: 220, background: BORDER, display: 'flex' }} />
          <div
            style={{
              position: 'absolute',
              left: 99,
              top: 99,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: BRAND,
              display: 'flex',
            }}
          />
        </div>

        {/* Top row: wordmark and the drift meter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={`data:image/svg+xml;base64,${logo}`} width={34} height={34} alt="" />
            <div style={{ ...display, letterSpacing: '-0.02em', fontSize: 30, color: HEADING, display: 'flex' }}>
              Calibrate<span style={{ color: BRAND }}>DS</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '10px 22px',
              border: `1px solid ${BORDER}`,
              borderRadius: 9999,
              background: PANEL,
              fontSize: 17,
              letterSpacing: '0.08em',
            }}
          >
            <span style={{ color: TEXT }}>Δ DRIFT</span>
            <span style={{ color: HEADING, fontWeight: 700 }}>0.0PX</span>
            <span style={{ color: BRAND }}>● IN REGISTER</span>
          </div>
        </div>

        {/* Headline: the registered word, with the misaligned layers it replaced */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={word}>Design and code,</div>
          <div style={{ display: 'flex', position: 'relative', marginTop: 4 }}>
            <div
              style={{
                ...word,
                position: 'absolute',
                left: -12,
                top: -8,
                color: 'rgba(182,141,66,0.3)',
              }}
            >
              calibrated.
            </div>
            <div style={{ ...word, position: 'absolute', left: 11, top: 7, color: 'rgba(255,240,212,0.1)' }}>
              calibrated.
            </div>
            <div
              style={{
                ...word,
                backgroundImage: `linear-gradient(115deg, ${HEADING} 0%, ${BRAND} 85%)`,
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              calibrated.
            </div>
          </div>
        </div>

        {/* Bottom row: the three instruments */}
        <div style={{ display: 'flex', borderTop: `1px solid ${BORDER}`, paddingTop: 26 }}>
          {CHANNELS.map((c, i) => (
            <div
              key={c.ch}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flex: 1,
                paddingLeft: i === 0 ? 0 : 28,
                borderLeft: i === 0 ? 'none' : `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 15, color: BRAND, letterSpacing: '0.12em' }}>CH {c.ch}</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: HEADING }}>{c.name}</span>
              </div>
              <span style={{ fontSize: 17, color: TEXT }}>{c.role}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
