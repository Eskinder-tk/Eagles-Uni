"use client";

import { Suspense, useMemo, useState } from "react";
import { verifySession } from '@/lib/session';
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type Course = {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  year: number;
  semester: string;
  type: "Core" | "Elective";
};

// DEMO DATA:
// Replace this with courses fetched from your database.
// Filter by the student's year and the selected semester on the server.
const availableCourses: Course[] = [
  {
    id: "cs101",
    code: "CS101",
    title: "Introduction to Programming",
    description:
      "Learn programming fundamentals, problem-solving, and basic algorithms.",
    credits: 4,
    year: 1,
    semester: "1",
    type: "Core",
  },
  {
    id: "math101",
    code: "MATH101",
    title: "Calculus I",
    description:
      "Study limits, derivatives, and the foundations of calculus.",
    credits: 3,
    year: 1,
    semester: "1",
    type: "Core",
  },
  {
    id: "math103",
    code: "MATH103",
    title: "Discrete Mathematics",
    description:
      "Explore logic, sets, relations, combinatorics, and mathematical proofs.",
    credits: 3,
    year: 1,
    semester: "1",
    type: "Core",
  },
  {
    id: "eng101",
    code: "ENG101",
    title: "Communicative English I",
    description:
      "Develop academic writing, reading comprehension, and communication skills.",
    credits: 2,
    year: 1,
    semester: "1",
    type: "Core",
  },
  {
    id: "cs102",
    code: "CS102",
    title: "Object-Oriented Programming",
    description:
      "Learn classes, objects, inheritance, encapsulation, and abstraction.",
    credits: 4,
    year: 1,
    semester: "2",
    type: "Core",
  },
  {
    id: "math102",
    code: "MATH102",
    title: "Calculus II",
    description:
      "Continue calculus with integration techniques and their applications.",
    credits: 3,
    year: 1,
    semester: "2",
    type: "Core",
  },
  {
    id: "stat101",
    code: "STAT101",
    title: "Introduction to Statistics",
    description:
      "Explore descriptive statistics, probability, distributions, and data analysis.",
    credits: 3,
    year: 1,
    semester: "2",
    type: "Core",
  },
];

const academicYears = [
  { id: 2, name: "2026/27" },
];

function CourseRegistrationContent () {
  const router = useRouter();
  const searchParams = useSearchParams();

  const academicYearId = searchParams.get("academicYearId") ?? "";
  const semester = searchParams.get("semester") ?? "";

  const academicYear =
    academicYears.find((year) => String(year.id) === academicYearId)
      ?.name ?? "Selected academic year";

  const semesterName =
    semester === "1"
      ? "Semester 1"
      : semester === "2"
        ? "Semester 2"
        : "Semester not selected";

  // DEMO ONLY: Load the current student's year from the database.
  const studentYear = 1;

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseType, setCourseType] = useState("All");
  const [error, setError] = useState("");

  const periodIsValid =
    Boolean(academicYearId) &&
    (semester === "1" || semester === "2");


  const visibleCourses = useMemo(() => {
    return availableCourses.filter((course) => {
      const matchesSemester = course.semester === semester;
      const matchesYear = course.year === studentYear;

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      const matchesType =
        courseType === "All" || course.type === courseType;

      return (
        matchesSemester &&
        matchesYear &&
        matchesSearch &&
        matchesType
      );
    });
  }, [semester, studentYear, searchQuery, courseType]);

  const selectedCourseDetails = availableCourses.filter((course) =>
    selectedCourses.includes(course.id)
  );

  const totalCredits = selectedCourseDetails.reduce(
    (total, course) => total + course.credits,
    0
  );

  function toggleCourse(courseId: string) {
    setSelectedCourses((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId]
    );

    setError("");
  }

  const handleReview = async () => {

    const auth = await verifySession()
    if (auth?.role != "user") {
        return (
            <div className="flex justify-center mt-30">
                <h1>Unauthorized!</h1>
            </div>
        )
    }

    if (!periodIsValid) {
      setError("Please select an academic year and semester first.");
      return;
    }

    if (selectedCourses.length === 0) {
      setError("Please select at least one course to continue.");
      return;
    }

    const params = new URLSearchParams({
      academicYearId,
      semester,
      courseIds: selectedCourses.join(","),
    });

    router.push(`/student/register/review?${params.toString()}`);
  }




  if (!periodIsValid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center dark:border-slate-700 dark:bg-slate-800">
          <CalendarDays className="mx-auto mb-4 text-[#094d7a] dark:text-sky-300" size={32} />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Select an academic period
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Choose your academic year and semester before registering for courses.
          </p>
          <button
            onClick={() => router.push("/student/register")}
            className="mt-6 rounded-xl bg-[#094d7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073b5e] dark:bg-sky-700 dark:hover:bg-sky-600"
          >
            Choose academic period
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-7 text-slate-900 transition-colors duration-200 dark:text-slate-100 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.push("/student/register")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#094d7a] dark:text-slate-300 dark:hover:text-sky-300"
        >
          <ArrowLeft size={17} />
          Academic period
        </button>

        {/* Page heading */}
        <header className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#094d7a] dark:bg-sky-950 dark:text-sky-300">
            <GraduationCap size={26} />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#094d7a] dark:text-sky-300">
            Eagles-Uni / Student portal
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Register for courses
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Select the courses you plan to take this semester. Review your
            selections and credit hours before submitting your registration.
          </p>
        </header>

        {/* Selected academic period */}
        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#094d7a] dark:bg-sky-950 dark:text-sky-300">
              <CalendarDays size={22} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Registration period
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                {academicYear} <span className="text-slate-400">/</span>{" "}
                {semesterName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              Year {studentYear}
            </span>
            <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#094d7a] dark:bg-sky-950 dark:text-sky-300">
              Computer Science
            </span>
          </div>
        </section>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Check size={17} />
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Academic period
          </span>

          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#094d7a] text-sm font-bold text-white dark:bg-sky-700">
            2
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            Select courses
          </span>
        </div>

        {/* Main layout */}
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* Available courses */}
          <section className="min-w-0">

            {/* Search and filters */}
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search courses or course codes..."
                    aria-label="Search courses"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#094d7a] focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
                  />
                </div>

                <select
                  value={courseType}
                  onChange={(event) => setCourseType(event.target.value)}
                  aria-label="Filter by course type"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#094d7a] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-400"
                >
                  <option value="All">All courses</option>
                  <option value="Core">Core courses</option>
                  <option value="Elective">Electives</option>
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{visibleCourses.length} courses available</span>
                <span>Choose courses below</span>
              </div>
            </div>

            {/* Course list heading */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Available courses
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {semesterName}
              </span>
            </div>

            {/* Course cards */}
            {visibleCourses.length > 0 ? (
              <div className="space-y-4">
                {visibleCourses.map((course) => {
                  const isSelected = selectedCourses.includes(course.id);

                  return (
                    <article
                      key={course.id}
                      className={`rounded-2xl border bg-white p-5 transition-colors duration-200 dark:bg-slate-800 sm:p-6 ${
                        isSelected
                          ? "border-[#094d7a] ring-1 ring-[#094d7a]/15 dark:border-sky-500 dark:ring-sky-500/20"
                          : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#094d7a] dark:bg-slate-700 dark:text-sky-300">
                          <BookOpen size={23} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold tracking-wide text-[#094d7a] dark:text-sky-300">
                              {course.code}
                            </span>
                            <span
                              className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                                course.type === "Core"
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                  : "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                              }`}
                            >
                              {course.type}
                            </span>
                          </div>

                          <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                            {course.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {course.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                              <GraduationCap size={15} />
                              Year {course.year}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 size={15} />
                              {course.credits} credit hours
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCourse(course.id)}
                          aria-pressed={isSelected}
                          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#094d7a] dark:focus-visible:ring-sky-400 ${
                            isSelected
                              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                              : "bg-[#094d7a] text-white hover:bg-[#073b5e] dark:bg-sky-700 dark:hover:bg-sky-600"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={16} />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus size={17} />
                              Add course
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-600 dark:bg-slate-800">
                <Search className="mx-auto mb-3 text-slate-400" size={28} />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  No courses found
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try another search term or change your course filter.
                </p>
              </div>
            )}
          </section>

          {/* Registration summary */}
          <aside className="lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Registration summary
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your selected courses
                </p>
              </div>

              {/* Summary numbers */}
              <div className="grid grid-cols-2 gap-3 p-5">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Selected courses
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedCourseDetails.length}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4 dark:bg-sky-950/60">
                  <p className="text-xs text-[#094d7a] dark:text-sky-300">
                    Total credits
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#094d7a] dark:text-sky-300">
                    {totalCredits}
                  </p>
                </div>
              </div>

              {/* Selected list */}
              <div className="px-5 pb-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Selected courses
                  </h3>
                  {selectedCourses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourses([]);
                        setError("");
                      }}
                      className="text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {selectedCourseDetails.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center dark:border-slate-600">
                    <BookOpen
                      size={24}
                      className="mx-auto mb-3 text-slate-400"
                    />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      No courses selected yet
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Add courses from the list to see them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCourseDetails.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#094d7a] dark:text-sky-300">
                            {course.code}
                          </p>
                          <p className="mt-1 text-sm font-medium leading-5 text-slate-800 dark:text-slate-200">
                            {course.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {course.credits} credit hours
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCourse(course.id)}
                          aria-label={`Remove ${course.title}`}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleReview}
                  disabled={selectedCourses.length === 0}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#094d7a] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#073b5e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#094d7a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-sky-700 dark:hover:bg-sky-600 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-800 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                >
                  Review registration
                  <ArrowRight size={17} />
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Review your selections before submitting your registration.
                </p>
              </div>
            </section>

            {/* Information */}
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="mt-0.5 text-[#094d7a] dark:text-sky-300">
                <Clock3 size={18} />
              </div>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your course selection is not submitted yet. You will review it
                before completing registration.
              </p>
            </div>
          </aside>
        </div>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
          Eagles-Uni · Student Academic Portal
        </footer>
      </div>
    </main>
  );
}

export default function CourseRegistrationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-8 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mt-6 h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-6 h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </main>
      }
    >
      <CourseRegistrationContent />
    </Suspense>
  );
}
