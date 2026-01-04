import Link from 'next/link';
import BaseLayout from '@/components/Layout';

export default function NotFound() {
  return (
    <BaseLayout>
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-slate-700">
            Page Not Found
          </h2>
          <p className="mt-4 text-slate-600 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
