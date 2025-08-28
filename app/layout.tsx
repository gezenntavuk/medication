import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "Ev Sağlık Yönetimi",
  description: "Evdeki tıbbi malzemeler ve ilaçları yönetmek için kullanılan uygulama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
