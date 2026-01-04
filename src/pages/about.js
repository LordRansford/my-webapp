import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Layout 
      title="About Ransford Chung Amponsah - CEng MIMechE TOGAF®" 
      description="Chartered Engineer, TOGAF Practitioner, and IMechE Council Member. Building clarity-first technical education for neurodivergent and neurotypical learners alike."
    >
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}>
        {/* Hero Section */}
        <header className="mb-12 space-y-8">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-2xl ring-4 ring-slate-100 shadow-xl">
              <Image
                src="/images/placeholder-photo.svg"
                alt="Ransford Chung Amponsah CEng MIMechE"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 192px, 192px"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">About</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                  Ransford Chung Amponsah
                </h1>
                <p className="mt-2 text-lg font-medium text-slate-700">
                  CEng MIMechE TOGAF® Enterprise Architecture Practitioner
                </p>
              </div>
              
              {/* Professional Badges */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/ransford-amponsah-ceng-mimeche-togaf%C2%AE-79489a105/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 transition-all hover:bg-blue-100 hover:border-blue-300 hover:shadow-md"
                  aria-label="View LinkedIn profile"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn Profile
                </a>
                
                <a
                  href="https://www.credly.com/badges/d36678f6-a316-46d9-8242-6b673d3b853e/public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-900 transition-all hover:bg-green-100 hover:border-green-300 hover:shadow-md"
                  aria-label="View TOGAF certification on Credly"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  TOGAF® Certification
                </a>
              </div>

              {/* Professional Memberships */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
                    <Image
                      src="/images/imeche-placeholder.svg"
                      alt="Institution of Mechanical Engineers"
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Council Member</p>
                    <p className="text-sm font-bold text-slate-900">IMechE</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
                    <Image
                      src="/images/togaf-placeholder.svg"
                      alt="TOGAF Certified"
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">Certified Practitioner</p>
                    <p className="text-sm font-bold text-slate-900">TOGAF®</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Why This Site Exists */}
        <section className="mb-12 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-3xl font-bold text-slate-900">Why this site exists</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-800">
            <p>
              I built this website for people who love technical things and want to become genuinely good at them, but do not always know where to start. That includes people like me and my wife who are neurodivergent, and plenty of neurotypical people too.
            </p>
            <p>
              A lot of technical content fails not because it is hard, but because it is badly explained. Concepts are wrapped in unexplained jargon, assumptions are left unstated, and if you miss one step, the whole explanation collapses. That makes deep understanding almost impossible, especially if you need clarity rather than vibes.
            </p>
            <p>
              So many of us end up teaching ourselves because the alternatives are frustrating, vague, or frankly unhelpful.
            </p>
            <p className="text-lg font-semibold text-slate-900">
              This site exists to fix that.
            </p>
            <p>
              Everything here is designed to take you from absolute beginner to real expertise, step by step, with explanations that do not skip logic, practical experiments you can actually try, and quizzes that test understanding rather than memorisation. The aim is not to impress you with complexity, but to remove it where it is unnecessary and explain it properly where it is not.
            </p>
            <p className="italic text-slate-700">
              If something cannot be explained clearly, it probably is not understood properly. That principle underpins the entire site.
            </p>
          </div>
        </section>

        {/* Who I Am */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Who I am</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
            <p className="text-lg">
              Hi, I&apos;m Ransford Chung Amponsah.
            </p>
            <p>
              I grew up in Ghana and moved to the UK at 16 to continue my education and be closer to family. I have always loved learning technical subjects and, just as importantly, teaching them in a way people can actually digest. I learn best by understanding how things really work, and I enjoy exchanging ideas with people who care about getting things right rather than sounding clever.
            </p>
            
            <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <h3 className="mb-4 text-xl font-semibold text-slate-900">Professional Background</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  By background, I am a <strong>Chartered Engineer</strong> and a <strong>TOGAF® Certified Practitioner</strong>, with formal training in AI including:
                </p>
                <ul className="ml-6 space-y-2 list-disc">
                  <li>Azure AI Fundamentals (AI-900)</li>
                  <li>Azure AI Engineer Associate (AI-102)</li>
                </ul>
                <p className="mt-4">
                  For my day job, I work as a <strong>senior manager in digitalisation for the GB energy sector as a regulator</strong>, leading sector-wide data and digital strategy and shaping how complex systems evolve in practice, not just on paper.
                </p>
                <p>
                  Alongside that, I volunteer with the <strong>Institution of Mechanical Engineers</strong> as a <strong>Council Member</strong> and <strong>Professional Reviewer</strong>, including chartership applications. I have also worked as a <strong>Mechanical Engineering Lecturer</strong>, teaching mathematics, statistics, and engineering principles to HNC, HND, and A-level students.
                </p>
                <p className="italic">
                  Teaching reinforced something I already suspected: clarity beats cleverness every time.
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  I will spare you the rest of the qualifications. This is not a CV and that is very much intentional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outside of Work */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Outside of work</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Physical Training */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Physical Training
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                I enjoy powerlifting and bodybuilding and am currently chasing a <strong>300 kg squat</strong> and a <strong>100 kg incline dumbbell press</strong>. Progress is slow, measurable, and humbling, which I find oddly comforting.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                I also love table tennis and used to play in local leagues, picking up a few borough-level championship trophies along the way.
              </p>
            </div>

            {/* Engineering & Making */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Engineering & Making
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                At home, I enjoy DIY projects and am currently building a garden to grow flowers for my wife, along with some fruit and vegetables. Engineering habits die hard.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                I tinker with robotics as a hobbyist, mostly because it combines logic, hardware, and patience in equal measure.
              </p>
            </div>

            {/* Motorbikes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Motorbikes
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                I am very into motorbikes and prefer to maintain, modify, and occasionally dismantle them myself. Past and present bikes include:
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-sm text-slate-700 list-disc">
                <li>UM Commando</li>
                <li>Triumph Rocket 3 GT (2022)</li>
                <li>Honda NC750X (2025)</li>
                <li>Honda CB125R (2025)</li>
              </ul>
            </div>

            {/* Entertainment & Balance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Entertainment & Balance
              </h3>
              <p className="text-sm leading-relaxed text-slate-700">
                For balance, I enjoy anime, with <em>One Piece</em> currently holding the crown, and I am always happy to watch K-dramas, shows like <em>Love Is Blind</em>, or detective films such as the <em>Knives Out</em> series with my dear wife.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                I enjoy cooking, catching up with friends, and spending time with our cat, Sesame, who runs the house.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6">
            <p className="text-base leading-relaxed text-slate-800">
              Most importantly, I am deeply grateful for my church family, for my wider family, and above all to God for my wife and the people around me. Their wisdom, patience, and guidance matter more to me than any professional achievement.
            </p>
          </div>
        </section>

        {/* The Short Version */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white">The short version</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-100">
            <p>
              This site is here to make hard things understandable, without dumbing them down.
            </p>
            <p>
              It is built for people who want depth, clarity, and honesty.
            </p>
            <p className="text-xl font-semibold text-white">
              If that sounds like you, you are in the right place.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg"
          >
            Explore Courses
          </Link>
          <Link
            href="/support/donate"
            className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:shadow-lg"
          >
            Support This Work
          </Link>
        </div>
      </StaticInfoTemplate>
    </Layout>
  );
}
