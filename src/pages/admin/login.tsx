import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { apiClient } from "@/shared/api/client";
import { useAuthForm } from "@/features/auth/hooks/use-auth-form";
import { FormTextField, FormPasswordField } from "@/shared/ui/form";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const { form, loading, error, setError, onSubmit } = useAuthForm();

  useEffect(() => {
    if (apiClient.isAuthenticated()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center space-y-1.5">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {isRegister ? "Register Admin Account" : "Portfolio Admin Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRegister ? "Create a new administrator account" : "Log in to manage your serverless portfolio applications"}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit(isRegister)} className="flex flex-col gap-4">
            {isRegister && (
              <>
                <FormTextField
                  name="name"
                  label="Full Name"
                  placeholder="Jane Doe"
                  prefixIcon={<User size={16} />}
                  register={form.register}
                  error={form.formState.errors.name}
                  required
                  className="space-y-1.5"
                />

                <FormTextField
                  name="bio"
                  label="Bio (Optional)"
                  placeholder="Software Engineer"
                  prefixIcon={<FileText size={16} />}
                  register={form.register}
                  error={form.formState.errors.bio}
                  className="space-y-1.5"
                />
              </>
            )}

            <FormTextField
              name="email"
              label="Email Address"
              type="email"
              placeholder="admin@ajikkk.my.id"
              prefixIcon={<Mail size={16} />}
              register={form.register}
              error={form.formState.errors.email}
              required
              className="space-y-1.5"
            />

            <FormPasswordField
              name="password"
              label="Password"
              placeholder="••••••••"
              prefixIcon={<Lock size={16} />}
              register={form.register}
              error={form.formState.errors.password}
              required
              className="space-y-1.5"
              inputClassName="pl-10"
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isRegister ? "Register" : "Log In"}
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-border text-xs">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
                form.reset();
              }}
              className="text-foreground hover:underline font-medium cursor-pointer"
            >
              {isRegister ? "Already have an account? Log In" : "Need a new account? Register here"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

