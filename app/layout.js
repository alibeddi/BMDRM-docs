import { Poppins } from 'next/font/google';
import './globals.css';
import { getDocsTreeNormalized, getFlattenedDocs } from '@/lib/api';
import Sidebar from '@/app/components/Sidebar';
import Providers from '@/app/providers';
import Topbar from '@/app/components/Topbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata = {
  title: 'BMDRM Docs',
  description: 'Documentation for BMDRM Project',
};

export default async function RootLayout({ children }) {
  const docTree = await getDocsTreeNormalized();
  const allDocs = getFlattenedDocs(docTree);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        <Providers>
          <div className="app-container">
            <Topbar docs={allDocs} />
            <div className="layout-body">
              <aside className="sidebar">
                <Sidebar tree={docTree} />
              </aside>
              <main className="content-wrapper">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
