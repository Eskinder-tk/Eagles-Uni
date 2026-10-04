"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Search,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { getAdmissionStatus } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  admissionId: z.string().min(1, "Please enter your admission ID."),
});

type FormValues = z.infer<typeof formSchema>;

type Admission = {
  admissionId: string;
  name: string;
  status: string;
  createdAt: Date;
};

export default function CheckAdmissionPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admission, setAdmission] = useState<Admission | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsChecking(true);
      setError(null);

      const result = await getAdmissionStatus(
        data.email,
        data.admissionId
      );

      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setAdmission(result.admission ?? null);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  // Show the result instead of the form
  if (admission) {
    return (
      <AdmissionStatus
        admission={admission}
        onBack={() => {
          setAdmission(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 text-slate-900 transition-colors dark:text-white">
      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <Card className="w-full max-w-lg border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white dark:bg-cyan-500">
              <Search className="h-6 w-6" />
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                Check Admission Status
              </CardTitle>

              <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
                Enter your email and admission ID to view your application status.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="text-slate-700 dark:text-slate-200">
                  Email Address
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isChecking}
                  className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  {...register("email")}
                />

                {errors.email && (
                  <FieldError>
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>

              {/* Admission ID */}
              <Field>
                <FieldLabel htmlFor="admissionId" className="text-slate-700 dark:text-slate-200">
                  Admission ID
                </FieldLabel>

                <Input
                  id="admissionId"
                  placeholder="Enter your admission ID"
                  disabled={isChecking}
                  className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  {...register("admissionId")}
                />

                {errors.admissionId && (
                  <FieldError>
                    {errors.admissionId.message}
                  </FieldError>
                )}
              </Field>

              {/* Server error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isChecking}
                className="w-full bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Admission
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function AdmissionStatus({
  admission,
  onBack,
}: {
  admission: Admission;
  onBack: () => void;
}) {
  const statusStyles: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    under_review:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
    accepted:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    rejected:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  const status =
    statusLabels[admission.status] ?? admission.status;

  return (
    <main className="min-h-screen px-4 py-12 text-slate-900 transition-colors dark:text-white">
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <Card className="w-full max-w-lg border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                Admission Status
              </CardTitle>

              <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
                Please check your email for more information.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Applicant
              </p>

              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {admission.name}
              </p>
            </div>

            {/* Admission ID */}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Admission ID
              </p>

              <p className="mt-1 break-all font-mono text-sm text-cyan-600 dark:text-cyan-400">
                {admission.admissionId}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current Status
              </p>

              <span
                className={`mt-2 inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${
                  statusStyles[admission.status] ??
                  "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {status}
              </span>
            </div>

            {/* Date */}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Application Date
              </p>

              <p className="mt-1 text-slate-900 dark:text-white">
                {new Date(admission.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Back */}
            <Button
              type="button"
              onClick={onBack}
              className="w-full border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Check Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}