"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCHOOL } from "@/lib/constants";
import { ROLE_LABEL, type UserRole } from "@/lib/types";
import { signOut } from "@/lib/actions/auth";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

function navItemsFor(role: UserRole): NavItem[] {
  if (role === "siswa")
    return [
      { href: "/dashboard/siswa", icon: "📄", label: "Pengajuan F01" },
      { href: "/dashboard/siswa/profil", icon: "👤", label: "Profil Saya" }
    ];
  if (role === "superadmin")
    return [
      { href: "/dashboard/admin", icon: "📊", label: "Ringkasan" },
      { href: "/dashboard/admin/users", icon: "👥", label: "Kelola Pengguna" },
      { href: "/dashboard/admin/submissions", icon: "📁", label: "Semua Pengajuan" }
    ];
  return [
    { href: "/dashboard/guru", icon: "✅", label: "Antrian Persetujuan" },
    { href: "/dashboard/guru/profil", icon: "👤", label: "Profil & Tanda Tangan" }
  ];
}

export function Shell({
  role,
  nama,
  children
}: {
  role: UserRole;
  nama: string;
  children: React.ReactNode;
}) {
  const items = navItemsFor(role);
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-[236px] bg-navy-dark text-[#EDF1F6] flex-shrink-0 flex flex-col">
        <div className="px-5 pt-5 pb-4 flex gap-3 items-center border-b border-white/10">
          <Image src={SCHOOL.logo} alt="logo" width={34} height={37} />
          <div>
            <div className="font-serif text-[14.5px] font-semibold leading-tight">SIM-PKL</div>
            <div className="text-[10.5px] text-[#A9B7C8] tracking-wide">SMKN 1 JAKARTA</div>
          </div>
        </div>
        <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
          {items.map(it => (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium ${
                pathname === it.href ? "bg-gold text-[#241B08] font-semibold" : "text-[#C7D2E0] hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-[17px] text-center text-[14px]">{it.icon}</span>
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pt-3.5 pb-4 border-t border-white/10">
          <div className="text-[12.5px] font-semibold mb-0.5">{nama}</div>
          <div className="text-[10.5px] text-[#A9B7C8] uppercase tracking-wide mb-2.5">{ROLE_LABEL[role]}</div>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost btn-sm w-full !border-white/25 !text-[#EDF1F6]">
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}

export function Topbar({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="bg-white border-b border-paper-line px-8 py-3.5">
      <h1 className="text-[19px]">{title}</h1>
      {sub && <div className="text-[12.5px] text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

export function Content({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 px-8 py-6 pb-16 max-w-[1180px] w-full mx-auto">{children}</div>;
}
