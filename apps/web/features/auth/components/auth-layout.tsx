import { Lock } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AuthLayoutProps {
  title: string;
  description: string;
  features: Feature[];
  children: React.ReactNode;
}

export function AuthLayout({ title, description, features, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel - Dark Side */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0B1120] p-12 text-white border-r border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-xl mb-16">
            <Lock className="w-6 h-6" />
            <span>MySafeVault</span>
          </div>
          <h1 className="text-4xl font-outfit font-bold mb-4">{title}</h1>
          <p className="text-slate-400 text-lg font-inter max-w-md">{description}</p>
        </div>

        {/* 3D Icon Placeholder */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl absolute" />
          <div className="z-10 w-48 h-48 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center shadow-2xl">
            <Lock className="w-20 h-20 text-[#10B981]" />
          </div>
        </div>

        <div className="space-y-6">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="p-2 bg-slate-800 rounded-lg text-[#10B981]">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="lg:hidden flex items-center gap-2 text-[#10B981] font-bold text-xl mb-12 justify-center">
            <Lock className="w-6 h-6" />
            <span>MySafeVault</span>
        </div>
        <div className="w-full max-w-sm mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
