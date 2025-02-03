import { useNavigate } from "react-router-dom";
import { SaveIcon } from "../icons/SaveIcon";
import { SecurityIcon } from "../icons/SecurityIcon";
import { CloudIcon } from "../icons/CloudIcon";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-anta tracking-tight">
              Stash It
            </h1>
            <p className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto">
              Your secure, personal storage solution for keeping track of
              everything important.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Get Started
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 text-blue-600">{<SaveIcon />}</div>
            </div>
            <h2 className="text-xl font-semibold mb-3">Easy Storage</h2>
            <p className="text-gray-600">
              Store and organize your important information with just a few
              clicks. Access your data anytime, anywhere.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 text-blue-600">
                <SecurityIcon />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-3">Secure & Private</h2>
            <p className="text-gray-600">
              Your data is encrypted and protected with industry-standard
              security measures. Your privacy is our priority.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 text-blue-600">
                <CloudIcon />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-3">Cloud Sync</h2>
            <p className="text-gray-600">
              Automatically sync your data across all your devices. Never worry
              about losing important information again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
