"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteUserAction, updateUserAction } from "@/lib/actions/users";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { idleState, type FormState, type User } from "@/lib/types";

type UserRowActionsProps = {
  user: User;
  dict: Dictionary["users"];
  common: Dictionary["common"];
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-xs text-red-600">{messages[0]}</p>;
}

/** Per-row edit and delete controls, each backed by a confirmation dialog. */
export function UserRowActions({ user, dict, common }: UserRowActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editState, setEditState] = useState<FormState<User>>(idleState);
  const [deleteState, setDeleteState] = useState<FormState<{ id: string }>>(idleState);
  const [editPending, startEdit] = useTransition();
  const [deletePending, startDelete] = useTransition();

  const editErrors = editState.status === "error" ? editState.fieldErrors : undefined;

  function handleEdit(formData: FormData) {
    startEdit(async () => {
      const result = await updateUserAction(idleState, formData);
      setEditState(result);
      if (result.status === "success") {
        setEditOpen(false);
        router.refresh();
      }
    });
  }

  function handleDelete(formData: FormData) {
    startDelete(async () => {
      const result = await deleteUserAction(idleState, formData);
      setDeleteState(result);
      if (result.status === "success") {
        setDeleteOpen(false);
        router.refresh();
      }
    });
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex flex-none items-center gap-0.5">
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditState(idleState);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={dict.edit}
            className="h-8 w-8 text-slate-400 hover:text-slate-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.editUser}</DialogTitle>
          </DialogHeader>
          <form action={handleEdit}>
            <input type="hidden" name="id" value={user.id} />
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`edit-firstName-${user.id}`}>{dict.firstName}</Label>
                  <Input
                    id={`edit-firstName-${user.id}`}
                    name="firstName"
                    defaultValue={user.firstName}
                    autoComplete="off"
                    required
                  />
                  <FieldError messages={editErrors?.firstName} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`edit-lastName-${user.id}`}>{dict.lastName}</Label>
                  <Input
                    id={`edit-lastName-${user.id}`}
                    name="lastName"
                    defaultValue={user.lastName}
                    autoComplete="off"
                    required
                  />
                  <FieldError messages={editErrors?.lastName} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`edit-email-${user.id}`}>{dict.email}</Label>
                <Input
                  id={`edit-email-${user.id}`}
                  name="email"
                  type="email"
                  defaultValue={user.email ?? ""}
                  autoComplete="off"
                />
                <FieldError messages={editErrors?.email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`edit-phone-${user.id}`}>{dict.phone}</Label>
                <Input
                  id={`edit-phone-${user.id}`}
                  name="phone"
                  type="tel"
                  defaultValue={user.phone ?? ""}
                  autoComplete="off"
                />
                <FieldError messages={editErrors?.phone} />
              </div>
              {editState.status === "error" && editState.message ? (
                <p className="text-sm text-red-600">{editState.message}</p>
              ) : null}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {common.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={editPending}>
                {common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteState(idleState);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={dict.delete}
            className="h-8 w-8 text-slate-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.deleteUser}</DialogTitle>
          </DialogHeader>
          <form action={handleDelete}>
            <input type="hidden" name="id" value={user.id} />
            <div className="px-6 py-4">
              <p className="text-sm text-slate-600">
                {dict.deleteWarning.replace("{name}", fullName)}
              </p>
              {deleteState.status === "error" && deleteState.message ? (
                <p className="mt-3 text-sm text-red-600">{deleteState.message}</p>
              ) : null}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {common.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" variant="danger" disabled={deletePending}>
                {dict.delete}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
