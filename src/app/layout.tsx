import type { Metadata } from 'next';
import './styles/index.css'; // or your index.css
import {Provider} from './providers';

export const metadata: Metadata = {
  title: 'Polish Perfection',
  description: 'Creative Excellence Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* fonts, meta, etc. auto-included */}
      </head>
      <body className="antialiased">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}