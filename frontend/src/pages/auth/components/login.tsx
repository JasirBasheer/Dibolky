import { memo, useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { SpinnerCircular } from "spinners-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "@/utils/axios";
import { validateEmail, validatePassword } from "@/validation/agencyValidation";
import CustomInput from "@/components/common/Input";
import { toast } from "sonner";

const LoginForm = ({ role }: { role: string }) => {
  const [email, setEmail] = useState("dibolky@gmail.com");
  const [password, setPassword] = useState("1234567890");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>("");

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const isNewlyCreatedAccount = searchParams.get("new");

  if (isNewlyCreatedAccount) {
    toast.success("Account successfully created, Login to continue...");
  }

  const onVerify = (token: string) => setToken(token);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateEmail(email)) {
      emailRef.current?.focus();
      toast.error("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      passwordRef.current?.focus();
      toast.error("Please enter a valid Password");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("/api/auth/login", { email, password, role });

      toast.success("Successfully Logged in");
      const roleRedirects = {
        agency: "/agency/",
        admin: "/admin/",
        client: "/client/",
      };
      navigate(roleRedirects[role as keyof typeof roleRedirects]);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const errorResponse = error as {
          response: { data: { error: string } };
        };
        toast.error(errorResponse.response.data.error);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <h2 className="text-3xl font-bold text-black mb-3">Welcome Back.</h2>
      <div className="space-y-4 py-4">
        <CustomInput
          inputRef={emailRef}
          id="Email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
        />
        <CustomInput
          inputRef={passwordRef}
          id="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          label="Password"
        />
        <HCaptcha
          sitekey="10000000-ffff-ffff-ffff-000000000001"
          onVerify={onVerify}
        />
        <button
          disabled={token === ""}
          type="submit"
          className="w-full h-[3rem] flex items-center justify-center bg-[#1c1e21f2] cursor-pointer text-white rounded-md py-2 px-4 hover:bg-[#1c1e21] transition duration-200 mt-6"
        >
          {isLoading ? (
            <SpinnerCircular
              size={20}
              thickness={200}
              speed={100}
              color="rgba(255, 255, 255, 1)"
              secondaryColor="rgba(0, 0, 0, 0.44)"
            />
          ) : (
            <>Login</>
          )}
        </button>
      </div>
    </form>
  );
};

export default memo(LoginForm);
