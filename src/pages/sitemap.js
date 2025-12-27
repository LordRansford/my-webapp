import Link from "next/link";
import Layout from "@/components/Layout";
import { siteStructure } from "@/lib/sitemap";
import { getAllPosts } from "@/lib/posts";
import {
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  FileText,
  Gamepad2,
  Wrench,
  GraduationCap,
  User,
  HelpCircle,
} from "lucide-react";

const iconMap = {
  courses: BookOpen,
  studios: FlaskConical,
  dashboards: LayoutDashboard,
  templates: FileText,
  games: Gamepad2,
  tools: Wrench,
  learning: GraduationCap,
  account: User,
  support: HelpCircle,
};

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts }, revalidate: 300 };
}

export default function SitemapPage({ posts }) {
  return (
    <Layout title="Site Map - Ransford's Notes" description="Complete site map showing all available pages and content.">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold text-slate-900">Site Map</h1>
          <p className="mt-3 text-lg text-slate-700">
            Complete navigation of all pages and content available on Ransford&apos;s Notes. Every page is accessible through links.
          </p>
        </header>

        <div className="space-y-12">
          {/* Courses */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Courses</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {siteStructure.courses.map((course) => (
                <div key={course.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                  <p className="mt-2 text-sm text-slate-700">{course.description}</p>
                  <div className="mt-4 space-y-2">
                    <Link href={course.href} className="block text-sm font-semibold text-slate-900 hover:text-slate-700">
                      {course.title} Overview →
                    </Link>
                    {course.levels?.map((level) => (
                      <Link key={level.href} href={level.href} className="block text-sm text-slate-700 hover:text-slate-900">
                        {level.title} →
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Studios */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FlaskConical className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Studios</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteStructure.studios.map((studio) => (
                <Link
                  key={studio.href}
                  href={studio.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{studio.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">Open studio →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Dashboards */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Dashboards</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {siteStructure.dashboards.map((dashboard) => (
                <Link
                  key={dashboard.href}
                  href={dashboard.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{dashboard.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">Open dashboards →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Templates */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Templates</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteStructure.templates.map((template) => (
                <Link
                  key={template.href}
                  href={template.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">Browse templates →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Games */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Gamepad2 className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Games</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {siteStructure.games.map((game) => (
                <Link
                  key={game.href}
                  href={game.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{game.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">Play games →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Tools</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteStructure.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{tool.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">Open tools →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Learning Resources */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Learning Resources</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteStructure.learning.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">View →</span>
                </Link>
              ))}
            </div>
            {posts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Blog Posts</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                    >
                      <h4 className="text-base font-semibold text-slate-900">{post.title}</h4>
                      {post.excerpt && <p className="mt-2 text-sm text-slate-700 line-clamp-2">{post.excerpt}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Support */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-slate-900">Support & Information</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteStructure.support.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <span className="mt-2 inline-block text-sm text-slate-600">Visit page →</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

