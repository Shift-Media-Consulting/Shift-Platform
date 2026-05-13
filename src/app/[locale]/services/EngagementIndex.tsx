type EngagementItem = { number: string; title: string; description: string }

export default function EngagementIndex({ items }: { items: EngagementItem[] }) {
  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .engagement-index-grid { grid-template-columns: 1fr !important; row-gap: 40px; }
        }
      `}</style>
      <div
        className="engagement-index-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          columnGap: '48px',
        }}
      >
        {items.map((item) => (
          <div
            key={item.number}
            style={{
              borderTop: '1px solid rgba(246,245,242,0.40)',
              paddingTop: '28px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: 'rgba(246,245,242,0.45)',
                marginBottom: '20px',
              }}
            >
              [{item.number}]
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 600,
                fontSize: 'clamp(28px, 3vw, 40px)',
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                color: '#f6f5f2',
                marginBottom: '16px',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: 'rgba(246,245,242,0.72)',
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
