
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  IdCard,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

type StudentProfile = {
  id: number;
  userCode: string;
  name: string;
  age: number;
  email: string;
  phone: string | null;
  profileUrl?: string | null;
  year: number | string;
  passwordHash: string;
};

type StudentProfileOverviewProps = {
  student: StudentProfile;
  profileHref?: string;
  coursesHref?: string;
  transcriptHref?: string;
};

export default function StudentProfileOverview({
  student,
  profileHref = "/Portal/Profile",
  coursesHref = "/Portal/Courses",
  transcriptHref = "/Portal/Grade",
}: StudentProfileOverviewProps) {
  const firstName = student.name.trim().split(/\s+/)[0];

  const initials = student.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const details = [
    {
      label: "Department",
      value: "Computer Science",
      Icon: Building2,
    },
    {
      label: "Academic year",
      value: student.year || "Not assigned",
      Icon: GraduationCap,
    },
    {
      label: "Section",
      value: "Not assigned",
      Icon: Users,
    },
    {
      label: "Portal email",
      value: student.email || "Not provided",
      Icon: Mail,
    },
  ];

  const quickLinks = [
    {
      title: "My Courses",
      description: "View your enrolled courses",
      href: coursesHref,
      Icon: BookOpen,
    },
    {
      title: "Academic Transcript",
      description: "Review your academic results",
      href: transcriptHref,
      Icon: FileText,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Eagles-Uni / Student Portal
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {firstName}
          </h1>

          <p className="mt-2 text-sm text-white/80 sm:text-base">
            Here is your academic overview.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-md sm:self-auto">
          <ShieldCheck size={17} />
          <span>Student Portal</span>
        </div>
      </header>

      {/* Main dashboard layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
        {/* Student profile */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
          {/* Profile header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600 px-6 py-7 text-white sm:px-8 sm:py-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-[30px] border-white/10"
            />

            <div className="relative z-10 mb-6 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                Student profile
              </p>

              <Link
                href={profileHref}
                aria-label="Edit profile settings"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Edit profile
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              {student.profileUrl ? (
                <Image
                  src={student.profileUrl}
                  alt={`${student.name}'s profile photo`}
                  width={112}
                  height={112}
                  unoptimized
                  className="h-24 w-24 rounded-2xl border-2 border-white/70 object-cover shadow-lg sm:h-28 sm:w-28"
                />
              ) : (
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-white/50 bg-white/15 text-3xl font-bold text-white shadow-lg backdrop-blur-sm sm:h-28 sm:w-28"
                  aria-label={`Initials: ${initials}`}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  {student.name}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/95">
                    <IdCard size={16} />
                    {student.userCode}
                  </span>
                </div>

                <p className="mt-3 break-all text-sm text-blue-100">
                  {student.email}
                </p>
              </div>
            </div>
          </div>

          {/* Academic information */}
          <div className="p-5 sm:p-8">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic information
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your registered academic details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="min-w-0 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 transition hover:border-blue-200 hover:bg-blue-50/60 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-blue-400/30 dark:hover:bg-blue-400/[0.06]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                      <Icon size={18} />
                    </span>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {label}
                    </span>
                  </div>

                  <p className="break-words text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Online examination username */}
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 dark:bg-white/10 dark:text-emerald-300">
                  <ShieldCheck size={20} />
                </div>
               
              </div>

              <span className="text-xs text-emerald-800 dark:text-emerald-300">
                Keep your password private
              </span>
            </div>
          </div>
        </section>

        {/* Right-side cards */}
        <aside className="space-y-6">
          {/* Quick access */}
          <section className="rounded-3xl border border-white/40 bg-white/95 p-5 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick access
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Jump straight to your academic resources.
              </p>
            </div>

            <div className="space-y-3">
              {quickLinks.map(({ title, description, href, Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 p-4 transition hover:border-blue-300 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:hover:border-blue-400/30 dark:hover:bg-blue-400/[0.06]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white dark:bg-blue-400/15 dark:text-blue-300 dark:group-hover:bg-blue-500">
                    <Icon size={21} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                      {title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {description}
                    </span>
                  </span>

                  <ArrowRight
                    size={17}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-300"
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* Account reminder */}
          <section className="rounded-3xl border border-white/40 bg-white/95 p-5 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300">
                <UserRound size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Keep your profile updated
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Make sure your contact information and profile photo are up to date.
                </p>

                <Link
                  href={profileHref}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-teal-300"
                >
                  Profile settings
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
