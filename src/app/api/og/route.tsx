import { ImageResponse } from 'next/og';
import { SITE_CONFIG, COLORS } from '@/lib/config';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || SITE_CONFIG.name;
        const description = searchParams.get('description') || SITE_CONFIG.description;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.bg,
                        color: COLORS.text,
                        fontFamily: 'sans-serif',
                        padding: '40px 80px',
                        textAlign: 'center',
                    }}
                >
                    {/* Background Pattern */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `radial-gradient(circle at 25px 25px, ${COLORS.bgSecondary} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${COLORS.bgSecondary} 2%, transparent 0%)`,
                            backgroundSize: '100px 100px',
                            opacity: 0.2,
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: COLORS.accent, // Accent color
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px',
                                boxShadow: `0 0 30px ${COLORS.accent}66`, // 40% opacity hex approximation
                            }}
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2L2 7L12 12L22 7L12 2Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M2 17L12 22L22 17"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M2 12L12 17L22 12"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 'bold', color: COLORS.accent }}>
                            {SITE_CONFIG.name}
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 800,
                            letterSpacing: '-0.025em',
                            lineHeight: 1.1,
                            marginTop: 20,
                            marginBottom: 20,
                            whiteSpace: 'pre-wrap',
                            backgroundImage: `linear-gradient(90deg, ${COLORS.textBright}, ${COLORS.textDim})`,
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {title}
                    </div>

                    {searchParams.get('description') && (
                        <div
                            style={{
                                fontSize: 24,
                                color: COLORS.textMuted,
                                maxWidth: '80%',
                            }}
                        >
                            {description.length > 100 ? description.slice(0, 100) + '...' : description}
                        </div>
                    )}
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error(`${errorMessage}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
