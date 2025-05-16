import { MessageSquareMore } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-12 text-white rounded-lg shadow-xl">
      <div className="max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <MessageSquareMore className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
        <p className="text-base text-white/80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
