import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'WIM-OS | West Istanbul Marina Operating System',
  description: '155,000m² Digital Twin of West Istanbul Marina with Gemini AI General Manager, VHF Ch. 72 Console, SEAL & MAKER engine, ada.legal, ada.finance (Paraşüt e-Fatura), and KVKK Vault.',
  openGraph: {
    title: 'WIM-OS | West Istanbul Marina Operating System',
    description: '155,000m² Digital Twin of West Istanbul Marina with Gemini AI General Manager, VHF Ch. 72 Console, SEAL & MAKER engine, ada.legal, ada.finance (Paraşüt e-Fatura), and KVKK Vault.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WIM-OS | West Istanbul Marina Operating System',
    description: '155,000m² Digital Twin of West Istanbul Marina with Gemini AI General Manager, VHF Ch. 72 Console, SEAL & MAKER engine, ada.legal, ada.finance (Paraşüt e-Fatura), and KVKK Vault.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
