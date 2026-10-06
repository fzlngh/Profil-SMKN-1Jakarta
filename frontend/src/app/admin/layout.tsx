import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "CMS — SMK Negeri 1 Jakarta",
  description: "Panel pengelolaan konten SMK Negeri 1 Jakarta."
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="cms-root">{children}</div>;
}
