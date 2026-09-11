import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="text-lg tracking-[-0.64px] font-medium text-[#111111]">
            {isRegister ? "Register Admin Account" : "Portfolio Admin Dashboard"}
          </h1>
          <p className="text-sm text-gray-500">
            {isRegister ? "Create a new administrator account" : "Log in to manage your serverless portfolio applications"}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
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
                inputClassName="h-10 bg-white border-gray-300 focus:border-[#ff5c06] focus:ring-1 focus:ring-[#ff5c06] text-[#111111] placeholder:text-gray-400 rounded-lg text-sm"
              />

              <FormTextField
                name="bio"
                label="Bio (Optional)"
                placeholder="Software Engineer"
                prefixIcon={<FileText size={16} />}
                register={form.register}
                error={form.formState.errors.bio}
                className="space-y-1.5"
                inputClassName="h-10 bg-white border-gray-300 focus:border-[#ff5c06] focus:ring-1 focus:ring-[#ff5c06] text-[#111111] placeholder:text-gray-400 rounded-lg text-sm"
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
            inputClassName="h-10 bg-white border-gray-300 focus:border-[#ff5c06] focus:ring-1 focus:ring-[#ff5c06] text-[#111111] placeholder:text-gray-400 rounded-lg text-sm"
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
            className="w-full mt-4 h-10 bg-[#ff5c06] hover:opacity-90 text-white font-semibold rounded-2xl shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)] flex items-center justify-center gap-2 cursor-pointer will-change-transform transition-opacity disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isRegister ? "Register" : "Log In"}
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-gray-200 text-xs">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              form.reset();
            }}
            className="text-[#ff5c06] hover:underline font-semibold"
          >
            {isRegister ? "Already have an account? Log In" : "Need a new account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}

