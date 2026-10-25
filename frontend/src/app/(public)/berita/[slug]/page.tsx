import { redirect } from "next/navigation";

export const revalidate = 60;

// Konsistensi URL berita: detail berita kini berada di /informasi/<slug>.
// Route /berita/[slug] disimpan sebagai alias permanen untuk tautan lama.
export default async function NewsDetailRedirectPage({ params }: { params: { slug: string } }) {
  redirect(`/informasi/${params.slug}`);
}
