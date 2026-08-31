import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOMELAB // Digital Twin & 3D Infrastructure Topology",
  description: "Living 3D perspective topology of dual-node Proxmox VE hypervisors, OPNsense security perimeter, KVM virtual machines, 23 LXC microservices, and ELO autonomous AI control plane.",
  keywords: ["homelab", "proxmox", "opnsense", "wireguard", "kubernetes", "k3s", "docker", "wazuh", "suricata", "elo-ai", "esp32"],
  authors: [{ name: "Stefanut", url: "https://github.com/stefanutc1" }],
  openGraph: {
    title: "HOMELAB // 3D Digital Twin & Autonomous AI Layer",
    description: "Interactive 3D perspective topology of dual Proxmox hypervisors, WireGuard mesh, and ELO AI.",
    url: "https://stefanutc1.github.io/homelab/",
    siteName: "Homelab Digital Twin",
    type: "website",
  },
  icons: {
    icon: "/icons/proxmox.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian text-slate-200 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
