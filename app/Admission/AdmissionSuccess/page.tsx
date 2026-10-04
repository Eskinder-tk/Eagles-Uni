"use client";

const AdmissionSuccess = ({
  admissionId,
}: {
  admissionId: string;
}) => {
  return (
    <div className="w-full h-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-white/6 p-8 text-white shadow-2xl backdrop-blur-xl sm:p-10">

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/10 ring-1 ring-cyan-400/30">
        <svg
          className="h-7 w-7 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="mt-6 text-3xl font-bold">
        Application submitted
      </h2>

      <p className="mt-3 text-white/60">
        Your application has been successfully submitted.
        Keep your admission number safe so you can check
        your admission status later.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6">
        <p className="text-sm text-white/50">
          Your Admission Number
        </p>

        <p className="mt-2 break-all text-xl font-semibold tracking-wider text-cyan-300">
          {admissionId}
        </p>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(admissionId)}
          className="mt-4 rounded-lg border border-cyan-400/20 hover:text-cyan-600 px-4 py-2 text-sm text-cyan-300"
        >
          Copy admission number
        </button>
      </div>

      <p className="mt-5 text-sm text-white/40">
        Save this number. You will need it to check your
        admission status.
      </p>

    </div>
  );
}
export default AdmissionSuccess;