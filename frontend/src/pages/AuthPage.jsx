import Login from "../components/Login";
import Signup from "../components/Signup";
import { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className=" min-h-screen flex items-center justify-center  bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200">
      <div  className="w-full max-w-md  p-4 sm:p-5 rounded-2xl  bg-white/80 backdrop-blur-md shadow-2xl animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-3xl font-bold text-center font-serif text-emerald-900 mb-4">
          {isLogin ? "Welcome Back " : "Join Us Today "}
        </h1>
        <div className="transition-all duration-500">
          {isLogin ? <Login /> : <Signup />}
        </div>
        <p className="text-center mt-6 text-emerald-700 cursor-pointer font-medium hover:text-emerald-900 transition-all duration-300 font-serif underline-offset-4 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create a new account": "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
