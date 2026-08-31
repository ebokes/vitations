import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Vitations - Premium Digital Invitations",
    template: "%s | Vitations",
  },
  description: "Create beautiful digital invitations for Nigerian weddings, birthdays, and celebrations. Elegant designs, interactive features, and seamless guest experiences.",
  keywords: ["digital invitations", "Nigerian weddings", "celebration invitations", "RSVP", "gift registry", "wedding invitations"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Vitations",
    title: "Vitations - Premium Digital Invitations",
    description: "Create beautiful digital invitations for Nigerian weddings, birthdays, and celebrations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitations - Premium Digital Invitations",
    description: "Create beautiful digital invitations for Nigerian weddings, birthdays, and celebrations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
