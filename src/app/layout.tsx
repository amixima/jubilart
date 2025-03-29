import { Metadata } from 'next';
import Layout from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'ArtLovers - Connect with Artists, Galleries, and Art Enthusiasts',
  description: 'ArtLovers is a community platform for artists, art galleries, art fairs, and art enthusiasts to connect, share, and discover amazing artwork.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
