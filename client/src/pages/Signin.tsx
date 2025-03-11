import { Button } from "../components/Button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { InputWithIcon } from "@/components/InputWithIcon";
import { toast } from "sonner";

export function Signin() {
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      toast.error("Error", {
        description: (
          <span className="text-red-400">"Please fill in all fields"</span>
        ),
        duration: 5000,
        style: {
          color: "red",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard", { replace: true });
      window.history.pushState(null, "", "/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast("Error", {
          description: "An error occurred. Please try again.",
          duration: 5000,
          style: {
            color: "black",
          },
        });
      } else {
        alert("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-50 via-white to-brand-300 flex justify-center items-center p-4 ">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl shadow-lg p-8 border-l-4 border-brand-600">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-semibold text-center text-gray-800">
              Sign In
            </h1>
            <p className="text-center text-gray-600">
              Access your secure storage with Stash It
            </p>
          </div>

          <div className="space-y-4">
            <InputWithIcon
              icon="user"
              placeholder="Username"
              ref={usernameRef}
              autoComplete="username"
            />

            <InputWithIcon
              icon="lock"
              type="password"
              placeholder="Password"
              ref={passwordRef}
              autoComplete="current-password"
            />
          </div>

          <Button
            className="w-full mt-6 h-12 bg-brand-600 hover:bg-brand-700 text-white transition-colors"
            onClick={signin}
            disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-brand-600 hover:text-brand-700 transition-colors font-medium">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
