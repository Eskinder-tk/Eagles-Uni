"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  FileText,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {Login} from "@/app/actions";
import { useRouter } from 'next/navigation';

// Zod Schema definition
const formSchema = z.object({
  id: z.string().min(3, "Student / Staff ID is required"),
  password: z.string().min(3, "Password is required"),
});

// Infer FormValues from Zod Schema
export type FormValues = z.infer<typeof formSchema>;


// Left side feature card interface
interface ActionTile {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  onClick?: () => void;
}

// Action cards configuration (Left side)
  const actionTiles: ActionTile[] = [
    {
      id: "exams",
      title: "Online Exams",
      description:
        "Prospective applicants and professionals can apply for and access exams.",
      icon: FileText,
      gradient: "from-blue-600 to-indigo-700",
    },
    {
      id: "admission",
      title: "Apply for Admission",
      description:
        "New applicants who aspire to join the university can apply online.",
      icon: GraduationCap,
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      id: "alumni",
      title: "Alumni Services",
      description:
        "Submit alumni service requests, verify transcripts, and access services.",
      icon: Users,
      gradient: "from-indigo-600 to-slate-700",
    },
  ];

const PortalLayout = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  const router = useRouter();

  // React Hook Form initialization with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setApiError(""); // Reset API error before submission
    
    try {
      const response = await Login(data.id, data.password);
      if (!response.success) {
        setApiError(response.error || "Invalid credentials. Please try again.");
        setTimeout(() => {
          setApiError(""); // Clear error after 5 seconds
        }, 5000);
      }
      router.push("/Portal/Dashboard");


    } catch (error) {
      setApiError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Feature / Quick Link Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col items-center mb-2">
            <h2 className="text-4xl font-bold text-gray-50 border-b-2 border-[#4837d1] pb-1 mb-2">
              University Services
            </h2>
            <p className="text-sm text-slate-50 dark:text-slate-400">
              Access online examinations, program admissions, and academic services.
            </p>
          </div>

          {actionTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.id}
                onClick={tile.onClick}
                className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-stretch"
              >
                {/* Visual Icon Box / Banner */}
                <div
                  className={`w-28 sm:w-36 shrink-0 bg-gradient-to-br ${tile.gradient} rounded-lg flex flex-col items-center justify-center text-white p-4 transition-transform group-hover:scale-[1.02]`}
                >
                  <Icon className="h-8 w-8 mb-1 opacity-90" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tile.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {tile.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Modernized Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            
            {/* Logo Slot Header */}
            <div className="pt-8 pb-2 flex flex-col items-center justify-center px-6">
              <Image
                src="/footer_Eagle.png"
                alt="Eagles University Logo"
                width={170}
                height={50}
                priority
                className="h-auto w-auto mt-2"
              />
            </div>

            <CardHeader className="text-center pt-0 pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Login to your account
              </CardTitle>
              <CardDescription className="text-xs">
                Enter your credentials to access the portal
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* API / Server Error */}
                {apiError && (
                  <div className="p-3 text-xs rounded-md bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 font-medium">
                    {apiError}
                  </div>
                )}

                {/* ID Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="id" className="text-xs font-semibold">
                    Student / Staff ID
                  </Label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500">
                      <User className="h-4 w-4" />
                    </span>
                    <Input
                      id="id"
                      type="text"
                      placeholder="ID"
                      {...register("id")}
                      className="rounded-l-none focus-visible:ring-1"
                    />
                  </div>
                  {errors.id && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.id.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="password font-semibold" className="text-xs">
                    Password
                  </Label>
                  <div className="flex rounded-md shadow-sm relative">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password")}
                      className="rounded-l-none pr-10 focus-visible:ring-1"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* Forgot Password Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
            
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default PortalLayout;