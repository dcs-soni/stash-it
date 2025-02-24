import { useState, useRef } from "react";
import { Button } from "@/components/Button";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputWithIcon } from "@/components/InputWithIcon";
import { toast } from "sonner";

export function Signup() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
      });

      toast.success("Success!", {
        description: "Your account has been created successfully.",
        duration: 5000,
      });
      navigate("/signin");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 411) {
        toast("Error", {
          description:
            "This username is already taken. Please choose another one.",
        });
      } else {
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-50 via-white to-brand-300 flex justify-center items-center p-4 ">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg p-8  border-l-4 border-brand-600">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-semibold text-center text-gray-800">
              Create Account
            </h1>
            <p className="text-center text-gray-600">
              Start storing your documents securely with Stash It
            </p>
          </div>

          <div className="space-y-4">
            <InputWithIcon
              icon="user"
              placeholder="Username"
              ref={usernameRef}
              error={errors.username}
              autoComplete="username"
            />

            <InputWithIcon
              icon="lock"
              type="password"
              placeholder="Password"
              ref={passwordRef}
              error={errors.password}
              autoComplete="new-password"
            />
          </div>

          <Button
            className="w-full mt-6 h-12 bg-brand-600 hover:bg-brand-700 text-white transition-colors"
            onClick={signup}
            disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
