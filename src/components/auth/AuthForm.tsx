"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { LoginInput, LoginSchema, RegisterInput, RegisterSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OAuthButton from "@/components/auth/OAuthButton";

const AuthForm = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Check for OAuth errors in URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      if (error) {
        if (error === "AccessDenied") {
          toast.error("Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Admin.");
          setSubmitMessage("OAuth login failed: Account not approved yet.");
        } else {
          toast.error("OAuth login failed. Please try again.");
          setSubmitMessage("OAuth login failed.");
        }
      }
    }
  }, []);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const onLoginSubmit = async (data: LoginInput) => {
    setSubmitMessage("Logging in...");

    // first check if the emailVerified is true
    const res = await fetch("/api/auth/check-email-verified", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });
    const result = await res.json();
    if (!result.emailVerified) {
      setSubmitMessage("Please verify your email before logging in.");
      toast.error("Please verify your email before logging in.");
      return;
    }

    const loginResult = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (loginResult?.error) {
      setSubmitMessage("Login failed: " + loginResult.error);
      toast.error("Invalid email or password.");
    } else {
      setSubmitMessage("Login successful! Redirecting...");
      // Optional: redirect zur geschützten Seite
      window.location.href = "/app"; 
    }
  };

  const onRegisterSubmit = async (data: RegisterInput) => {
    setSubmitMessage("Registering... Please wait.");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
        setSubmitMessage("");
        return;
      }

      toast.success("Successfully registered! Check your email to verify.");
      setAuthMode("login");
      registerForm.reset();
    } catch (error) {
      toast.error("An error occurred during registration.");
      setSubmitMessage("");
    }
  };

  const handleTabChange = (value: string) => {
    setAuthMode(value as "login" | "register");
    setSubmitMessage("");
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background & UI Layout wie gehabt */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-8">
          <Tabs value={authMode} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl border border-accent/40 shadow-inner mb-6 overflow-visible">
              <TabsTrigger
                value="login"
                className="text-primary text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white transition-colors duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-primary text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white transition-colors duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-2">
              <div className="bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/90 border border-slate-700/50 shadow-xl rounded-xl">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-blue-400 mb-2 text-center">Sign in</h2>
                  <p className="text-gray-400 text-center mb-6">Enter your email and password to access your account</p>
                  <div className="flex flex-col space-y-4 mb-6">
                    <OAuthButton type="github" />
                    <OAuthButton type="discord" />
                  </div>

                  <div className="flex items-center text-gray-400 mb-6">
                    <hr className="flex-grow border-t border-gray-600" />
                    <span className="mx-3 text-sm select-none">Or</span>
                    <hr className="flex-grow border-t border-gray-600" />
                  </div>

                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <div>
                      <Label htmlFor="login-email" className="text-primary">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        {...loginForm.register("email")}
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 rounded-lg mt-1"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-400 mt-1">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="text-primary">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        {...loginForm.register("password")}
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 rounded-lg mt-1"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-400 mt-1">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </form>
                  {submitMessage && (
                    <p className="mt-4 text-center text-sm text-red-400">{submitMessage}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-2">
              <div className="bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/90 border border-slate-700/50 shadow-xl rounded-xl">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-purple-400 mb-2 text-center">Create account</h2>
                  <p className="text-gray-400 text-center mb-6">Enter your details to create a new account</p>

                  <div className="flex flex-col space-y-4 mb-6">
                    <OAuthButton type="github" />
                    <OAuthButton type="discord" />
                  </div>

                  <div className="flex items-center text-gray-400 mb-6">
                    <hr className="flex-grow border-t border-gray-600" />
                    <span className="mx-3 text-sm select-none">Or</span>
                    <hr className="flex-grow border-t border-gray-600" />
                  </div>

                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    <div>
                      <Label htmlFor="register-username" className="text-primary">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Enter your username"
                        {...registerForm.register("username")}
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-400 mt-1">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-email" className="text-primary">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        {...registerForm.register("email")}
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-400 mt-1">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-password" className="text-primary">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Enter your password"
                        {...registerForm.register("password")}
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-400 mt-1">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-confirm-password" className="text-primary">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        {...registerForm.register("confirmPassword")}
                        className="bg-slate-900 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 rounded-lg mt-1"
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-400 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    >
                      Create Account
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {submitMessage && (
            <div className="mt-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-200 rounded-xl px-4 py-3 text-center shadow-lg">
                {submitMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
