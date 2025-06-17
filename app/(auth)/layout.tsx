import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body  className={`${bricolage.variable}  antialiased`} 
      >
        <div className="min-h-screen flex items-center justify-center flex-col">
                {children}
        </div>
    
      </body>
    </html>
  );
}
