import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";
import { authorData } from "../../data/author";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Layout title="About - Ransford's Notes" description="Who I am, why I build tools, and how this stays practitioner-first.">
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}>
        <header className="page-header">
          <p className="eyebrow">About</p>
          <h1>{authorData.name}</h1>
          <p className="lead">
            {authorData.role}
          </p>
          <div className="mt-4">
              <Link href={authorData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                  <span>Connect on LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 21.227.792 22 1.771 22h20.451C23.2 22 24 21.227 24 20.451V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
          </div>
           {/* Profile Picture */}
           <div className="relative w-full max-w-xl my-8 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
               <Image
                 src="/images/ransford-profile.jpg"
                 alt="Ransford Chung Amponsah"
                 fill
                 className="object-cover"
                 priority
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
           </div>
        </header>

        {authorData.sections.map((section, index) => (
          <section key={index} className="section">
            <h2>{section.title}</h2>
            {Array.isArray(section.content) ? (
              section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p>{section.content}</p>
            )}
          </section>
        ))}

        <section className="section">
            <h2>Certifications & Memberships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {authorData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-gray-50/50">
                        <div className="relative w-48 h-48 mb-4">
                            <Image
                                src={cert.image}
                                alt={cert.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 25vw"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-center mb-2">{cert.name}</h3>
                        {cert.description && <p className="text-sm text-gray-600 text-center mb-4">{cert.description}</p>}
                        {cert.link && (
                            <Link href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                                Verify Credential
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </section>
      </StaticInfoTemplate>
    </Layout>
  );
}
