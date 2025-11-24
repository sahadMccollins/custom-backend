import { BannersSection } from "@/components/banners-section";
import { SplashScreenSection } from "@/components/splash-screen-section";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-muted/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">
            Mobile App Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your splash screens and banners
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <SplashScreenSection />

          <BannersSection />
        </div>
      </div>
    </main>
  );
}
