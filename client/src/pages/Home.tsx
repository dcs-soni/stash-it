import { useNavigate } from "react-router-dom";
import { SaveIcon } from "../icons/SaveIcon";
import { SecurityIcon } from "../icons/SecurityIcon";
import { CloudIcon } from "../icons/CloudIcon";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with animated background */}
      <div className="relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <h1 className="animate-fade-in-up text-5xl md:text-7xl font-bold font-anta tracking-tight text-white mb-4">
            Stash It
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto text-white/90 leading-relaxed">
            Your secure, personal storage solution for keeping track of
            everything important.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Get Started
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Sign In
            </button>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Features Section with hover effects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Stash It?
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature cards with hover animation */}
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <div className="w-8 h-8 text-blue-600 group-hover:text-white flex justify-center items-center  ">
                {<SaveIcon />}
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Easy Storage</h2>
            <p className="text-gray-600 leading-relaxed">
              Store and organize your important information with just a few
              clicks. Access your data anytime, anywhere.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <div className="w-8 h-8 text-blue-600 group-hover:text-white flex justify-center items-center">
                <SecurityIcon />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Secure & Private</h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is encrypted and protected with industry-standard
              security measures. Your privacy is our priority.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <div className="w-8 h-8 text-blue-600 group-hover:text-white flex justify-center items-center">
                <CloudIcon />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Cloud Sync</h2>
            <p className="text-gray-600 leading-relaxed">
              Automatically sync your data across all your devices. Never worry
              about losing important information again.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">50M+</div>
              <div className="text-gray-600">Files Stored</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">5⭐</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Ready to get started?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who trust Stash It for their storage needs.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
