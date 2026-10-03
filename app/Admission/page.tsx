"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

import AdmissionSuccess from "./AdmissionSuccess/page";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldError} from "@/components/ui/field"; // Uses your field.tsx
import { uploadToVercelBlob, createAdmission } from "@/app/actions";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  age: z.coerce.number().min(16, "Age must be at least 16.").max(120, "Please enter a valid age."),
  phone: z.string().min(7, "Invalid phone number.").regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number format."),
  image: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "Image is required.")
    .refine((files) => files && files[0]?.size <= MAX_FILE_SIZE, "Max image size is 4.5MB.")
    .refine((files) => files && ACCEPTED_IMAGE_TYPES.includes(files[0]?.type), "Only JPG, PNG, and WEBP supported."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [admissionId, setAdmissionId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", data.image[0]);

      const imageUrl = await uploadToVercelBlob(formData);

      const admissionData = { ...data, imageUrl };
      const result = await createAdmission(admissionData);

      if (!result.success) {
        // Show error to user
        setSubmissionError(result.error);
        return;
      }

      setAdmissionId(result.admissionId);
      
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setValue("image", undefined as unknown as FileList, { shouldValidate: true });
  };

  return (

    <div className="relative min-h-screen overflow-hidden mb-20">
      
      <div className="relative z-10 min-h-screen lg:flex">

        <div className="lg:hidden flex flex-col items-baseline justify-center px-8 py-12">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            <span className="text-xs font-medium tracking-[0.25em] text-cyan-300">
              ADMISSION
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-7 text-5xl font-bold leading-tight xl:text-6xl ml-15">
            Start your
            <span className="block bg-linear-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              journey with us.
            </span>
          </h1>
        </div>

        <div className="hidden lg:flex lg:w-[42%] items-center ml-16 px-12 xl:px-20">
        <div className="max-w-lg text-white">

          {/* Small label */}
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
            <span className="text-xs font-medium tracking-[0.25em] text-cyan-300">
              ADMISSION
            </span>
          </div>

          {/* Heading */}
          <h1 className="flex gap-3 mt-7 text-5xl font-bold leading-tight xl:text-6xl">
            How to
            <span className="block bg-linear-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Apply.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-md text-base leading-7 text-white/60">
            Complete your profile and submit your ESSLCE result to begin the
            admission process.
          </p>

          {/* Steps */}
          <div className="mt-10 space-y-4">

            {/* Step 1 */}
            <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm transition hover:border-cyan-400/30 hover:bg-white/[0.07]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                01
              </div>

              <div>
                <h3 className="font-medium text-white">
                  Enter your information
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  Provide your name, email, phone number and other required details.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm transition hover:border-cyan-400/30 hover:bg-white/[0.07]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                02
              </div>

              <div>
                <h3 className="font-medium text-white">
                  Upload your ESSLCE result
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  Upload a clear JPG, PNG or WEBP image of your result.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm transition hover:border-cyan-400/30 hover:bg-white/[0.07]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                03
              </div>

              <div>
                <h3 className="font-medium text-white">
                  Submit your application
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  Review your information and submit your application for processing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm transition hover:border-cyan-400/30 hover:bg-white/[0.07]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                04
              </div>

              <div>
                <h3 className="font-medium text-white">
                  Track your admission
                </h3>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  Keep your admission ID and use it later to check your application
                  status.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {admissionId ? (
        <AdmissionSuccess admissionId={admissionId} />
      ) : (

      <Card className="w-full max-w-lg mx-auto shadow-md dark:bg-gray-800 mb-50 mt-20">
        {submissionError && (
          <p className="text-sm text-red-400 text-center">
            {submissionError}
          </p>
        )}
        <CardHeader>
          <CardTitle className="text-xl font-bold">Registration</CardTitle>
          <CardDescription>Provide Your detail and Your ESSLCE Result.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" placeholder="Eskinder Tekeste" disabled={isUploading} {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input id="email" type="email" placeholder="easkindrtk@gmail.com" disabled={isUploading} {...register("email")} />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            {/* Age & Phone Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <Input id="age" type="number" placeholder="25" disabled={isUploading} {...register("age")} />
                {errors.age && <FieldError>{errors.age.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input id="phone" type="tel" placeholder="+251911123456" disabled={isUploading} {...register("phone")} />
                {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
              </Field>
            </div>

            {/* Image Upload */}
            <Field>
              <FieldLabel>ESSLCE Result</FieldLabel>
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 border-muted-foreground/25 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-7 h-7 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground/75 mt-1">PNG, JPG, or WEBP (Max 1MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={isUploading}
                    {...register("image", { onChange: handleImageChange })}
                  />
                </label>
              ) : (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                  <Image src={preview} width={150} height={150} alt="Uploaded preview" className="h-full w-full object-cover" />
                  {!isUploading && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
              {errors.image && <FieldError>{errors.image.message}</FieldError>}
            </Field>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-2" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Submit Profile"
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
      )}
    </div>
    </div>
  );
}