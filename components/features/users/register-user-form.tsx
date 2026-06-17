"use client";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUserAction } from "@/lib/actions/users";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { idleState } from "@/lib/types";

type RegisterUserFormProps = {
  dict: Dictionary["users"];
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-xs text-red-600">{messages[0]}</p>;
}

/** Card containing the "register user" form, wired to {@link registerUserAction}. */
export function RegisterUserForm({ dict }: RegisterUserFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(registerUserAction, idleState);
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <UserPlus className="h-5 w-5 text-blue-600" />
          {dict.register}
        </h2>
      </CardHeader>
      <CardBody>
        <form ref={formRef} action={action} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">{dict.firstName}</Label>
              <Input id="firstName" name="firstName" autoComplete="off" required />
              <FieldError messages={fieldErrors?.firstName} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">{dict.lastName}</Label>
              <Input id="lastName" name="lastName" autoComplete="off" required />
              <FieldError messages={fieldErrors?.lastName} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">{dict.email}</Label>
            <Input id="email" name="email" type="email" autoComplete="off" />
            <FieldError messages={fieldErrors?.email} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">{dict.phone}</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="off" />
            <FieldError messages={fieldErrors?.phone} />
          </div>

          <p className="text-xs text-slate-500">{dict.contactHint}</p>

          {state.status === "error" && state.message ? (
            <p className="text-sm text-red-600">{state.message}</p>
          ) : null}
          {state.status === "success" ? (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              {dict.created}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {dict.addUser}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
