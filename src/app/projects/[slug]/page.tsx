import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  Download,
  Github,
} from "lucide-react";
import { projects } from "@/data/projects";
import ProjectGallery from "@/components/project-gallery";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: "Project not found" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const socialPreview = siteUrl ? ["/og/portfolio.webp"] : undefined;
  return {
    title: p.title,
    description: p.description,
    ...(siteUrl ? { alternates: { canonical: `/projects/${p.slug}` } } : {}),
    openGraph: {
      title: `${p.title} — Milan Raut`,
      description: p.description,
      type: "article",
      ...(socialPreview ? { images: socialPreview } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} — Milan Raut`,
      description: p.description,
      ...(socialPreview ? { images: socialPreview } : {}),
    },
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <main className="detail-page">
      <Link href="/#projects" className="back-link">
        <ArrowLeft size={16} /> Return to mission archive
      </Link>
      <p className="eyebrow">MISSION FILE / {p.category.toUpperCase()}</p>
      <h1>{p.title}</h1>
      <p className="detail-lede">{p.description}</p>
      <div className="detail-cover">
        <Image
          src={p.coverImage}
          alt={`${p.title} project icon`}
          fill
          priority
          sizes="(max-width: 800px) 100vw, 1100px"
          style={{ objectFit: "contain", padding: "48px" }}
        />
      </div>
      <section className="detail-copy">
        <div>
          <p className="eyebrow">MISSION BRIEF</p>
          <p>{p.longDescription}</p>
          {p.problem && (
            <>
              <p className="eyebrow detail-subhead">PROBLEM / PURPOSE</p>
              <p>{p.problem}</p>
            </>
          )}
        </div>
        <div>
          <p className="eyebrow">TECHNOLOGY LOADOUT</p>
          <div className="tag-list">
            {p.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {p.highlights && p.highlights.length > 0 && (
            <>
              <p className="eyebrow detail-subhead">DEVELOPMENT HIGHLIGHTS</p>
              <ul className="detail-list">
                {p.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      {p.features && p.features.length > 0 && (
        <section className="detail-features" aria-labelledby="feature-title">
          <p className="eyebrow">MISSION CAPABILITIES</p>
          <h2 id="feature-title">
            What it <em>does.</em>
          </h2>
          <ul>
            {p.features.map((feature, index) => (
              <li key={feature}>
                <span>0{index + 1}</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}
      <ProjectGallery title={p.title} images={p.screenshots} />
      {p.videoUrl && (
        <p className="detail-video-link">
          <a href={p.videoUrl} target="_blank" rel="noreferrer">
            Watch project demonstration <ArrowUpRight size={14} />
          </a>
        </p>
      )}
      {p.downloadLinks && p.downloadLinks.length > 0 && (
        <section className="download-section" aria-labelledby="download-title">
          <div>
            <p className="eyebrow">ANDROID PACKAGE / DIRECT DOWNLOAD</p>
            <h2 id="download-title">
              Take the mission
              <br />
              <em>with you.</em>
            </h2>
          </div>
          <div className="download-options">
            {p.downloadLinks.map((download) => (
              <div className="download-option" key={download.href}>
                <div>
                  <strong>{download.label}</strong>
                  <span>
                    {download.fileSize && `${download.fileSize} · APK file`}
                    {download.version && ` · Version ${download.version}`}
                  </span>
                  {download.releaseNotes && <p>{download.releaseNotes}</p>}
                </div>
                <a href={download.href} download>
                  <Download size={16} /> DOWNLOAD FILE{" "}
                  <ArrowDownToLine size={15} />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="detail-actions">
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noreferrer">
            <Github size={17} /> Source code <ArrowUpRight size={15} />
          </a>
        )}
        {p.documentationUrl && (
          <a href={p.documentationUrl} target="_blank" rel="noreferrer">
            Project notes <ArrowUpRight size={15} />
          </a>
        )}
        {p.liveUrl && (
          <a href={p.liveUrl}>
            Open live mission <ArrowUpRight size={15} />
          </a>
        )}
        <Link href="/#projects">
          More missions <ArrowLeft size={15} />
        </Link>
      </div>
      <footer className="detail-footer">
        MILAN RAUT <span>THE STORY IS STILL BEING WRITTEN.</span>
      </footer>
    </main>
  );
}
