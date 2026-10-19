
"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  GraduationCap,
  IdCard,
  Mail,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

export type StudentProfileData = {
  fullName: string;
  studentId: string;
  email: string;
  phone?: string | null;
  department: string;
  year: number;
  section?: string | null;
  profileImage?: string | null;
};

type SaveResult = {
  success?: boolean;
  message?: string;
  student?: StudentProfileData;
};

type StudentProfileSettingsEditorProps = {
  student: StudentProfileData;
  onSave: (
    formData: FormData
  ) => Promise<SaveResult | void>;
  dashboardHref?: string;
};

type EditableFields = {
  fullName: string;
  email: string;
  phone: string;
};

function getEditableFields(
  student: StudentProfileData
): EditableFields {
  return {
    fullName: student.fullName,
    email: student.email,
    phone: student.phone ?? "",
  };
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

export default function StudentProfileSettingsEditor(
  props: StudentProfileSettingsEditorProps
) {
  return (
    <StudentProfileSettingsEditorForm
      key={JSON.stringify(props.student)}
      {...props}
    />
  );
}

function StudentProfileSettingsEditorForm({
  student,
  onSave,
  dashboardHref = "/Portal/Dashboard",
}: StudentProfileSettingsEditorProps) {
  const [savedStudent, setSavedStudent] =
    useState<StudentProfileData>(student);

  const [form, setForm] = useState<EditableFields>(
    () => getEditableFields(student)
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savedAvatarFile, setSavedAvatarFile] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    student.profileImage ?? null
  );

  const [photoChanged, setPhotoChanged] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);

  // Revoke the active object URL when the editor unmounts.
  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
    };
  }, []);

  function setAvatarFilePreview(file: File | null) {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      avatarObjectUrlRef.current = objectUrl;
      setAvatarPreview(objectUrl);
    } else {
      setAvatarPreview(null);
    }
  }

  const initials = form.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const hasFieldChanges =
    form.fullName.trim() !== savedStudent.fullName ||
    form.email.trim() !== savedStudent.email ||
    form.phone.trim() !== (savedStudent.phone ?? "");

  const hasChanges = hasFieldChanges || photoChanged;

  function updateField(
    field: keyof EditableFields,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFeedback(null);
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) ||
      !extension ||
      !allowedExtensions.includes(extension)
    ) {
      setPhotoError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 4.5 * 1024 * 1024) {
      setPhotoError("Your image must be smaller than 4.5 MB.");
      event.target.value = "";
      return;
    }

    setAvatarFile(file);
    setAvatarFilePreview(file);
    setPhotoChanged(true);
    setRemovePhoto(false);
    setPhotoError("");
    setFeedback(null);
  }

  function handleRemovePhoto() {
    setAvatarFile(null);
    setAvatarFilePreview(null);
    setRemovePhoto(true);
    setPhotoChanged(true);
    setPhotoError("");
    setFeedback(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleReset() {
    setForm(getEditableFields(savedStudent));
    setAvatarFile(savedAvatarFile);
    if (savedAvatarFile) {
      setAvatarFilePreview(savedAvatarFile);
    } else {
      setAvatarFilePreview(null);
      setAvatarPreview(savedStudent.profileImage ?? null);
    }
    setRemovePhoto(false);
    setPhotoChanged(false);
    setPhotoError("");
    setFeedback(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!fullName || !email) {
      setFeedback({
        type: "error",
        message: "Full name and email are required.",
      });
      return;
    }

    if (!hasChanges) return;

    setSaving(true);
    setFeedback(null);

    try {
      const formData = new FormData();

      formData.set("fullName", fullName);
      formData.set("email", email);
      formData.set("phone", phone);

      formData.set(
        "removeProfileImage",
        photoChanged && removePhoto ? "true" : "false"
      );

      if (photoChanged && avatarFile) {
        formData.set("profileImage", avatarFile);
      }

      const result = await onSave(formData);

      if (result?.success === false) {
        setFeedback({
          type: "error",
          message: result.message ?? "Unable to update your profile.",
        });
        return;
      }

      const updatedStudent: StudentProfileData =
        result?.student ?? {
          ...savedStudent,
          fullName,
          email,
          phone: phone || null,
          profileImage: photoChanged && removePhoto
            ? null
            : savedStudent.profileImage,
        };

      setSavedStudent(updatedStudent);
      setForm(getEditableFields(updatedStudent));

      if (result?.student) {
        // The server returned the latest saved profile.
        setAvatarFile(null);
        setSavedAvatarFile(null);
        setAvatarFilePreview(null);
        setAvatarPreview(result.student.profileImage ?? null);
      } else if (photoChanged && avatarFile && !removePhoto) {
        // Keep the local preview until fresh server data is provided.
        setSavedAvatarFile(avatarFile);
      } else if (photoChanged && removePhoto) {
        setAvatarFile(null);
        setSavedAvatarFile(null);
        setAvatarFilePreview(null);
      }

      setPhotoChanged(false);
      setRemovePhoto(false);
      setPhotoError("");

      setFeedback({
        type: "success",
        message: result?.message ?? "Your profile has been updated.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving your profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page heading */}
      <header className="mb-7">
        <a
          href={dashboardHref}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/90 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </a>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          Eagles-Uni / Account
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Profile settings
        </h1>

        <p className="mt-2 text-sm text-white/80 sm:text-base">
          Manage your personal information and profile photo.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        {/* Editor */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
          {/* Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600 px-6 py-7 text-white sm:px-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-[30px] border-white/10"
            />

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <UserRound size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold">Personal information</h2>
                <p className="mt-1 text-sm text-blue-100">
                  Update the contact details associated with your account.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8 p-5 sm:p-8">
              {/* Profile picture */}
              <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 dark:border-white/10 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-2xl font-bold text-blue-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-blue-300">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt={`${form.fullName}'s profile photo`}
                      fill
                      sizes="96px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    initials || <UserRound size={36} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Profile photo
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Use a clear photo so your instructors and university
                    administrators can recognize you.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="student-profile-photo"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-within:ring-4 focus-within:ring-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <Camera size={16} />
                      Upload photo
                    </label>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                      >
                        <X size={15} />
                        Remove
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      id="student-profile-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    JPG, PNG, or WebP · Maximum 4.5 MB
                  </p>

                  {photoError && (
                    <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {photoError}
                    </p>
                  )}
                </div>
              </div>

              {/* Editable fields */}
              <div>
                <h3 className="mb-5 text-base font-bold text-slate-900 dark:text-white">
                  Contact details
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelClass}>
                      Full name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={150}
                        value={form.fullName}
                        onChange={(e) =>
                          updateField("fullName", e.target.value)
                        }
                        className={`${inputClass} pl-11`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={form.email}
                        onChange={(e) =>
                          updateField("email", e.target.value)
                        }
                        className={`${inputClass} pl-11`}
                        placeholder="student@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        maxLength={30}
                        value={form.phone}
                        onChange={(e) =>
                          updateField("phone", e.target.value)
                        }
                        className={`${inputClass} pl-11`}
                        placeholder="+251 9..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  role={feedback.type === "error" ? "alert" : "status"}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    feedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] dark:text-emerald-300"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/[0.07] dark:text-red-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  ) : (
                    <X size={19} className="mt-0.5 shrink-0" />
                  )}

                  <p>{feedback.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving || !hasChanges}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                >
                  <RotateCcw size={16} />
                  Reset changes
                </button>

                <button
                  type="submit"
                  disabled={saving || !hasChanges || !!photoError}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition hover:from-blue-800 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />
                  {saving ? "Saving changes..." : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Read-only academic information */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/40 bg-white/95 p-5 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                <GraduationCap size={22} />
              </span>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Academic record
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  University-managed details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200/80 p-4 dark:border-white/10">
                <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <IdCard size={16} />
                  <span className="text-xs">Student ID</span>
                </div>
                <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                  {savedStudent.studentId}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 p-4 dark:border-white/10">
                <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <GraduationCap size={16} />
                  <span className="text-xs">Department</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {savedStudent.department || "Not assigned"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200/80 p-4 dark:border-white/10">
                  <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                    Academic year
                  </p>
                  <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {savedStudent.year || "Not assigned"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 p-4 dark:border-white/10">
                  <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                    Section
                  </p>
                  <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {savedStudent.section || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 p-4 dark:bg-blue-400/[0.07]">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-700 dark:text-blue-300"
              />
              <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                Your student ID and academic placement are managed by the
                university and cannot be edited here.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/40 bg-white/95 p-5 shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-950/80 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300">
                <ShieldCheck size={20} />
              </span>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Keep your account secure
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Make sure your email and phone number are current so you can
                  receive important university communications.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
