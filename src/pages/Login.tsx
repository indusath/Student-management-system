import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() && password.trim()) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md bg-background p-8 rounded-2xl shadow-lg">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
  <img
    src="/kdu-logo.png"
    alt="KDU Logo"
    className="w-11 h-11 object-contain"
  />
</div>
      
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Administrator Login
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            KDU Student Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full h-11">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>

        {/* Signup */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            Don't have an account?{" "}
          </span>
          <span
            onClick={() => navigate("/signup")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}