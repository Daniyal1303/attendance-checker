"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/timesheets");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      {/* Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo variant="dark" className="mb-10 lg:hidden" />
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              Remember me
            </label>

            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>

      {/* Brand panel */}
      <div className="hidden overflow-hidden bg-blue-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="max-w-md h-full flex flex-col  justify-center">
          <h2 className="text-4xl font-bold leading-tight text-white">
            AttenDO
          </h2>
          <p className="mt-4 text-base text-blue-100">
            Introducing AttenDO, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            AttenDO, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
