
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifySession } from '@/lib/session';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  GraduationCap,
  BookOpen,
  Clock3,
} from "lucide-react";

const academicYears = [
  { id: 2, name: "2026/27" },
];

const semesters = [
  {
    value: "1",
    title: "Semester 1",
    description: "Register for first-semester courses.",
  },
  {
    value: "2",
    title: "Semester 2",
    description: "Register for second-semester courses.",
  },
];

export default function RegistrationPeriodPage() {
  const router = useRouter();

  const [academicYearId, setAcademicYearId] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!academicYearId || !semester) {
      setError("Please select an academic year and semester.");
      return;
    }
    const auth = await verifySession()
    if (auth?.role != "user") {
      setError("Invalid account")
      return;
    }

    const params = new URLSearchParams({
      academicYearId,
      semester,
    });

    router.push(`/Portal/Register/Courses?${params.toString()}`);
  }

  return (
    <main className="min-h-screen  px-4 py-8 text-slate-900 transition-colors duration-200 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-[#094d7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#094d7a] dark:text-slate-300 dark:hover:text-sky-300 dark:focus-visible:ring-sky-400"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        {/* Page heading */}
        <header className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#094d7a] dark:bg-sky-950 dark:text-sky-300">
            <GraduationCap size={26} />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#094d7a] dark:text-sky-300">
            Eagles-Uni / Student portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Course registration
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Choose the academic year and semester you are registering for.
            You can review and select your courses in the next step.
          </p>
        </header>

        {/* Registration progress */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#094d7a] text-sm font-bold text-white dark:bg-sky-700">
            1
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Academic period
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current step
            </p>
          </div>

          <div className="mx-1 h-px flex-1 bg-slate-200 dark:bg-slate-600" />

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
            2
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Select courses
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Next step
            </p>
          </div>
        </div>

        {/* Selection form */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-5 py-6 dark:border-slate-700 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
              Select your academic period
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select the period for which you intend to register.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            {/* Academic year */}
            <div className="mb-8">
              <label
                htmlFor="academicYear"
                className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                <CalendarDays
                  size={18}
                  className="text-[#094d7a] dark:text-sky-300"
                />
                Academic year
              </label>

              <select
                id="academicYear"
                value={academicYearId}
                onChange={(event) => {
                  setAcademicYearId(event.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-[#094d7a] focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-950"
              >
                <option value="" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  Choose an academic year
                </option>

                {academicYears.map((year) => (
                  <option
                    key={year.id}
                    value={year.id}
                    className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {year.name}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Only academic years open for registration should be available.
              </p>
            </div>

            {/* Semester selection */}
            <div className="mb-8">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <BookOpen
                  size={18}
                  className="text-[#094d7a] dark:text-sky-300"
                />
                Semester
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {semesters.map((item) => {
                  const selected = semester === item.value;

                  return (
                    <button
                      type="button"
                      key={item.value}
                      aria-pressed={selected}
                      onClick={() => {
                        setSemester(item.value);
                        setError("");
                      }}
                      className={`group relative rounded-xl border p-5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#094d7a] dark:focus-visible:ring-sky-400 ${
                        selected
                          ? "border-[#094d7a] bg-blue-50 ring-1 ring-[#094d7a]/20 dark:border-sky-400 dark:bg-sky-950/50 dark:ring-sky-400/20"
                          : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500 dark:hover:bg-slate-700/60"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                            selected
                              ? "bg-[#094d7a] text-white dark:bg-sky-700"
                              : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-slate-600"
                          }`}
                        >
                          <BookOpen size={20} />
                        </div>

                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                            selected
                              ? "border-[#094d7a] bg-[#094d7a] text-white dark:border-sky-400 dark:bg-sky-500 dark:text-slate-950"
                              : "border-slate-300 text-transparent dark:border-slate-500"
                          }`}
                        >
                          <Check size={14} />
                        </span>
                      </div>

                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Validation message */}
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                {error}
              </p>
            )}

            {/* Footer actions */}
            <div className="flex flex-col-reverse gap-4 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                <Clock3
                  size={16}
                  className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500"
                />
                Your course registration is not submitted at this step.
              </p>

              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#094d7a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#073b5e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#094d7a] focus-visible:ring-offset-2 dark:bg-sky-700 dark:hover:bg-sky-600 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-800 sm:w-auto"
              >
                Continue to courses
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Eagles-Uni · Student Academic Portal
        </footer>
      </div>
    </main>
  );
}
