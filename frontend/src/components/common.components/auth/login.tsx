import { memo, useState, useRef } from "react";
import { message } from "antd";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { SpinnerCircular } from "spinners-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "@/utils/axios";
import { validateEmail, validatePassword } from "@/validation/agencyValidation";

interface LoginFormProps {
  role: string;
}
const LoginForm = ({ role }: LoginFormProps) => {
  const [email, setEmail] = useState("jasirbinbasheerpp@gmail.com");
  const [password, setPassword] = useState("Jasir@123");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>("");

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const isNewlyCreatedAccount = searchParams.get("new");

  if (isNewlyCreatedAccount) {
    message.success("Account successfully created");
    message.success("Login to continue");
  }

  const onVerify = (token: string) => setToken(token);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateEmail(email)) {
      emailRef.current?.focus();
      message.error("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      passwordRef.current?.focus();
      message.error("Please enter a valid Password");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/login", { email, password, role });
      setIsLoading(false);

      if (response?.status === 200) {
        message.success("Successfully Logged in");
        const roleRedirects = { agency: "/agency", admin: "/admin/", client: "/client/" };
        navigate(roleRedirects[role as keyof typeof roleRedirects]);
      }
    } catch (error: unknown) {
      setIsLoading(false);
      message.error("Unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <h2 className="text-3xl font-bold text-black mb-3">Welcome Back.</h2>
      <div className="space-y-4 py-4">
        <div>
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            ref={emailRef}
            id="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            ref={passwordRef}
            id="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <HCaptcha sitekey="10000000-ffff-ffff-ffff-000000000001" onVerify={onVerify} />
        <button
          disabled={token === ""}
          type="submit"
          className="w-full h-[3rem] flex items-center justify-center bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition duration-200 mt-6"
        >
          {isLoading ? (
            <SpinnerCircular size={20} thickness={200} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" />
          ) : (
            <>Login</>
          )}
        </button>
      </div>
    </form>
  );
};

export default memo(LoginForm);
