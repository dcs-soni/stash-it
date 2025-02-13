import { useState, useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [loading, setLoading] = useState(false);

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

      alert("You have signed up successfully!");
      navigate("/signin");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 411) {
        alert("Username already exists");
      } else {
        alert("Error signing up. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-600 to-blue-400 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <div className="w-full p-2">
          <Input reference={usernameRef} placeholder="Username" />
          <Input
            reference={passwordRef}
            placeholder="Password"
            type="password"
          />
        </div>

        <div className="flex justify-center p-2 w-full">
          <Button
            onClick={signup}
            variant="primary"
            text="Sign Up"
            fullWidth={true}
            loading={loading}
          />
        </div>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
