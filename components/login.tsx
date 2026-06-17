"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { signInAction } from "@/lib/actions/auth";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { idleState } from "@/lib/types";

type LoginProps = {
  lang: Locale;
  dict: Dictionary["login"];
  appName: string;
};

export default function Login({ lang, dict, appName }: LoginProps) {
  const [state, action, pending] = useActionState(signInAction, idleState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo variant="dark" className="mb-10 lg:hidden" />
          <h1 className="text-2xl font-bold text-slate-900">{dict.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{dict.subtitle}</p>

          <form className="mt-8 space-y-4" action={action}>
            <input type="hidden" name="lang" value={lang} />

            <div className="space-y-1.5">
              <Label htmlFor="username">{dict.username}</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="admin"
                required
              />
              {fieldErrors?.username ? (
                <p className="text-xs text-red-600">{fieldErrors.username[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{dict.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
              {fieldErrors?.password ? (
                <p className="text-xs text-red-600">{fieldErrors.password[0]}</p>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              {dict.rememberMe}
            </label>

            {state.status === "error" && state.message ? (
              <p className="text-sm text-red-600">{state.message}</p>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {dict.signIn}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden overflow-hidden bg-blue-600 lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="max-w-md">
          <Logo variant="light" className="mb-6" />
          <h2 className="text-4xl font-bold leading-tight text-white">{appName}</h2>
          <p className="mt-4 text-base text-blue-100">{dict.brandDescription}</p>
        </div>
      </div>
    </div>
  );
}
