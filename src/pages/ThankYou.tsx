import { Bird } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <Bird className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You for Joining!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          We're excited to have you on board. Watch your email for updates about our impending launch.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;