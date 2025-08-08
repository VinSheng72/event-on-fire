"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type FormValues = z.infer<typeof formSchema>;

export default function AdminLoginPage() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && isAdmin) {
      router.replace("/admin/events");
    }
  }, [user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      const isAdmin = useAuthStore.getState().isAdmin();
      if (!isAdmin) {
        logout();
        toast.error("You must log in as an admin to access this page.");
        return;
      }
      router.replace("/admin/events");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
