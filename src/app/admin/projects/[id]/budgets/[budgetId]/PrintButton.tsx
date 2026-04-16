'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: '8px 16px',
        fontSize: '12px',
        fontWeight: 700,
        fontFamily: "'Poppins', Calibri, Arial, sans-serif",
        backgroundColor: '#F6F5F2',
        border: '1px solid #DDDDDD',
        borderRadius: '4px',
        cursor: 'pointer',
        color: '#555555',
      }}
    >
      🖨 Print
    </button>
  )
}
