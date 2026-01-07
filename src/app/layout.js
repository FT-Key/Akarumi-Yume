import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'Akarumi Yume - 明るみ夢 | Tienda Anime',
  description: 'Donde los sueños brillantes cobran vida. Figuras, manga, ropa y accesorios de anime.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.className} ${notoSansJP.className}`}>
      <body className="antialiased bg-black text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}