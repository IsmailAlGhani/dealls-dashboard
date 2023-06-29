import Providers from "./components/Providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dealls Dashboard",
  description: "Developed for Frontend Engineer Test Dealls",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        suppressHydrationWarning={true}
        style={{ margin: 0 }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
