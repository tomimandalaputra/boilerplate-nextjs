"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { createUserSchema, type CreateUserInput } from "../schema";
import { useCreateUser } from "../api/use-create-user";

export function CreateUserForm() {
  const createUser = useCreateUser();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "" }, // controlled fields require defaults
  });

  // handleSubmit only calls this after client Zod passes (gate 1).
  function onSubmit(values: CreateUserInput) {
    createUser.mutate(values, {
      onSuccess: () => {
        toast.success("User created.");
        form.reset();
      },
      onError: (error) => {
        // gate 2: the server is the real validator. Map its field errors
        // (ApiErrorBody.errors, PRD §10.1) back onto the inputs so users see them.
        if (error instanceof ApiError && error.errors) {
          for (const [field, messages] of Object.entries(error.errors)) {
            form.setError(field as keyof CreateUserInput, {
              message: messages[0],
            });
          }
        } else {
          toast.error(error.message);
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@example.com" {...field} />
              </FormControl>
              <FormDescription>We&apos;ll never share this.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createUser.isPending}>
          {createUser.isPending ? "Creating…" : "Create user"}
        </Button>
      </form>
    </Form>
  );
}
