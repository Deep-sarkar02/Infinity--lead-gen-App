import { IlCheckboxRow } from "@/components/IlCheckboxRow";

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className={`shrink-0 ${className}`}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        opacity="0.9"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        opacity="0.85"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        opacity="0.9"
      />
    </svg>
  );
}

export interface LoginFormProps {
  variant?: "mobile" | "web";
  title: string;
  subtitle: string;
  firebaseReady: boolean;
  agreedTerms: boolean;
  onAgreedTermsChange: (v: boolean) => void;
  error: string | null;
  canSignIn: boolean;
  googleLoading: boolean;
  demoLoading: boolean;
  onGoogleSignIn: () => void;
  onDemoSignIn: () => void;
}

export function LoginForm({
  variant = "mobile",
  title,
  subtitle,
  firebaseReady,
  agreedTerms,
  onAgreedTermsChange,
  error,
  canSignIn,
  googleLoading,
  demoLoading,
  onGoogleSignIn,
  onDemoSignIn,
}: LoginFormProps) {
  const isWeb = variant === "web";

  return (
    <div className={isWeb ? "w-full max-w-[470px]" : "w-full"}>
      <div className={isWeb ? "mb-10 text-center" : "text-center"}>
        <h1
          className={
            isWeb
              ? "text-[32px] font-medium leading-tight text-il-neutral-20"
              : "text-[28px] font-medium leading-tight text-il-neutral-20"
          }
        >
          {title}
        </h1>
        <p
          className={
            isWeb
              ? "mx-auto mt-4 max-w-[470px] text-sm leading-5 text-il-neutral-50"
              : "mx-auto mt-2 max-w-[320px] text-sm leading-5 text-il-neutral-50"
          }
        >
          {subtitle}
        </p>
      </div>

      {!firebaseReady && (
        <div className={`rounded-2xl border border-il-warning-90 bg-il-warning-95 px-4 py-3 ${isWeb ? "mt-8" : "mt-6"}`}>
          <p className="text-sm font-medium text-il-warning-40">Firebase not configured</p>
          <p className="mt-1 text-xs text-il-text-secondary">
            Add keys to <code className="text-il-text-primary">client/.env</code> or use demo mode
            below.
          </p>
        </div>
      )}

      <div className={isWeb ? "mt-8" : "mt-6"}>
        <IlCheckboxRow checked={agreedTerms} onChange={onAgreedTermsChange}>
          <span className="inline">
            By signing in you agree to our{" "}
            <span className="font-medium text-il-blue-40">T&amp;C</span> and{" "}
            <span className="font-medium text-il-blue-40">Privacy Policy</span>
          </span>
        </IlCheckboxRow>
      </div>

      {error && (
        <p className={`text-sm text-il-error-50 ${isWeb ? "mt-4" : "mt-4 text-center"}`} role="alert">
          {error}
        </p>
      )}

      <div className={isWeb ? "mt-10 space-y-4" : "mt-8 space-y-3"}>
        <button
          type="button"
          disabled={!canSignIn || !firebaseReady}
          onClick={onGoogleSignIn}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-il-blue-40 px-6 py-4 text-base font-medium text-white transition enabled:hover:bg-il-blue-30 disabled:cursor-not-allowed disabled:bg-il-neutral-90 disabled:text-il-neutral-50"
        >
          <GoogleIcon className="text-white" />
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        <div className={isWeb ? "flex flex-col items-center gap-1" : ""}>
          <button
            type="button"
            disabled={!canSignIn || demoLoading}
            onClick={onDemoSignIn}
            className={`text-sm font-medium text-il-blue-40 hover:underline disabled:opacity-50 ${
              isWeb ? "h-11 px-4" : "flex w-full items-center justify-center py-2.5"
            }`}
          >
            {demoLoading ? "Starting demo…" : "Continue in Demo Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
