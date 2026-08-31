import type { Metadata, Viewport } from "next";
import { Lora, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stefanut Homelab — Living 3D Digital Twin & Systems Architecture",
  description: "Comprehensive documentation and living 3D digital twin of a dual-hypervisor Proxmox homelab, WireGuard multi-VLAN zero-trust mesh, Wazuh SIEM, and ELO autonomous AI operating plane.",
  keywords: ["homelab", "proxmox", "opnsense", "wireguard", "kubernetes", "k3s", "docker", "wazuh", "suricata", "elo-ai", "esp32"],
  authors: [{ name: "Stefanut", url: "https://github.com/stefanutc1" }],
  openGraph: {
    title: "Stefanut Homelab — Living 3D Digital Twin",
    description: "Interactive 3D topology and architecture documentation of a dual-hypervisor Proxmox cluster.",
    url: "https://stefanutc1.github.io/homelab/",
    siteName: "Stefanut Homelab",
    type: "website",
  },
  icons: {
    icon: "/icons/proxmox.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#151210" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${lora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen selection:bg-terracotta-500/25 selection:text-terracotta-800 dark:selection:text-terracotta-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
