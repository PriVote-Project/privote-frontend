import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Privote - Private, Secure, and Verifiable Voting with MACI';
export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          background: '#0a0a0f',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Animated gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(127, 88, 183, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(198, 94, 198, 0.15) 0%, transparent 50%)',
            display: 'flex'
          }}
        />
        
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            display: 'flex'
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            padding: '80px',
            position: 'relative',
            justifyContent: 'space-between'
          }}
        >
          {/* Top section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Logo */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #c65ec6 0%, #7f58b7 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.03em',
                display: 'flex'
              }}
            >
              PRIVOTE
            </div>
            
            {/* Tagline */}
            <div
              style={{
                fontSize: 32,
                color: '#ffffff',
                fontWeight: 600,
                lineHeight: 1.3,
                maxWidth: '700px',
                display: 'flex'
              }}
            >
              Private, Secure, and Verifiable Voting
            </div>
            
            <div
              style={{
                fontSize: 24,
                color: '#888',
                fontWeight: 400,
                display: 'flex'
              }}
            >
              Powered by MACI Protocol
            </div>
          </div>

          {/* Bottom section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(127, 88, 183, 0.2) 0%, rgba(127, 88, 183, 0.1) 100%)',
                    border: '1px solid rgba(127, 88, 183, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}
                >
                  🔒
                </div>
                <span style={{ fontSize: 20, color: '#fff', fontWeight: 500 }}>Private</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(198, 94, 198, 0.2) 0%, rgba(198, 94, 198, 0.1) 100%)',
                    border: '1px solid rgba(198, 94, 198, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}
                >
                  🛡️
                </div>
                <span style={{ fontSize: 20, color: '#fff', fontWeight: 500 }}>Secure</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(127, 88, 183, 0.2) 0%, rgba(127, 88, 183, 0.1) 100%)',
                    border: '1px solid rgba(127, 88, 183, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}
                >
                  ✔
                </div>
                <span style={{ fontSize: 20, color: '#fff', fontWeight: 500 }}>Verifiable</span>
              </div>
            </div>

            {/* URL */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: '#888',
                  fontWeight: 500,
                  display: 'flex'
                }}
              >
                🌐
              </div>
              <div
                style={{
                  fontSize: 28,
                  background: 'linear-gradient(135deg, #c65ec6 0%, #7f58b7 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 600,
                  display: 'flex'
                }}
              >
                privote.live
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle at top right, rgba(198, 94, 198, 0.1) 0%, transparent 70%)',
            display: 'flex'
          }}
        />
      </div>
    ),
    {
      ...size
    }
  );
}

