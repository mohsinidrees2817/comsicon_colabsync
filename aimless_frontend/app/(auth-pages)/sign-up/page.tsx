'use client';

import { useState, useTransition } from "react";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Signup(props: { searchParams: Message }) {
  const searchParams = props.searchParams;
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    formData.append("role", role);
    console.log(role, "role");

    startTransition(() => {
      // ✅ Make sure to return the promise
      signUpAction(formData);
    });
  };


  return (
    <form
      className="flex flex-col min-w-64 max-w-64 mt-32 mx-auto"
      action={handleSubmit} // ✅ call your custom handler!
    >

      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link
          className="text-primary font-medium underline"
          href="/sign-in"
        >
          Sign in
        </Link>
      </p>

      <div className="flex flex-col gap-2 mt-8">
        <Label htmlFor="username">Username</Label>
        <Input name="username" placeholder="jdoe68" required />

        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Your password"
            minLength={6}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Must be at least 6 characters.
        </p>

        <Label htmlFor="role">Select Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="role" value={role} />

        <button
          type="submit"
          disabled={isPending}
          className={`mt-4 flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded hover:bg-black/80 transition ${isPending ? 'opacity-60 cursor-not-allowed' : ''
            }`}
        >
          {isPending && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          )}
          {isPending ? "Signing up..." : "Sign up"}
        </button>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
