import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between h-screen">
      <Navbar />
      <main className="container mx-auto px-6 pt-16">
        {children}
      </main>
      <footer className="container mx-auto">
        {footer}
      </footer>
    </div>
  );
}
