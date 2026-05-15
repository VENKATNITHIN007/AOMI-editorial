import { MainHeader } from "@/components/layout/Header/MainHeader";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer variant="dark" />
    </div>
  );
}
