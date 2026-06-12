import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SplitPanelLayout } from "@/components/SplitPanelLayout";
import { SuccessScreen } from "@/components/SuccessScreen";
import { createLead } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface AddLeadFormProps {
  name: string;
  phone: string;
  error: string | null;
  formId: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

function AddLeadForm({
  name,
  phone,
  error,
  formId,
  onNameChange,
  onPhoneChange,
  onSubmit,
}: AddLeadFormProps) {
  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor={`${formId}-name`} className="mb-1.5 block text-sm font-medium">
          Student name *
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Full name"
          autoFocus
          required
          className="w-full rounded-xl border border-il-neutral-90 bg-il-bg-grey-tint px-4 py-3.5 outline-none focus:border-il-blue-30 focus:ring-2 focus:ring-il-blue-90"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className="mb-1.5 block text-sm font-medium">
          Phone number *
        </label>
        <div className="flex overflow-hidden rounded-xl border border-il-neutral-90 bg-il-bg-grey-tint focus-within:border-il-blue-30 focus-within:ring-2 focus-within:ring-il-blue-90">
          <span className="flex items-center border-r border-il-neutral-90 px-3 text-sm text-il-text-secondary">
            +91
          </span>
          <input
            id={`${formId}-phone`}
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile"
            required
            maxLength={10}
            className="w-full bg-transparent px-4 py-3.5 outline-none"
          />
        </div>
        {phone.length > 0 && phone.length < 10 && (
          <p className="mt-1.5 text-xs text-il-error">Enter a valid 10-digit number</p>
        )}
      </div>

      {error && <p className="text-sm text-il-error">{error}</p>}
    </form>
  );
}

function MobileSuccessCard({
  savedName,
  onAddAnother,
}: {
  savedName: string;
  onAddAnother: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="il-mobile-login-bg flex min-h-screen flex-col px-4 pb-8 pt-14 lg:hidden">
      <MobileHomeHeader title="Add Lead" onBack={() => navigate("/leads")} />

      <div className="rounded-[20px] bg-white px-6 py-10 shadow-[0_4px_20px_rgba(1,47,99,0.12)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-il-blue-30 text-white shadow-elevated">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-xl font-bold text-il-neutral-10">Lead added!</h2>
          <p className="mt-2 max-w-xs text-sm text-il-neutral-50">
            {savedName} has been saved as unverified. We&apos;ll verify the lead shortly.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onAddAnother}
              className="w-full rounded-full bg-il-blue-30 py-3.5 text-sm font-semibold text-white hover:bg-il-blue-20"
            >
              Add another lead
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-full border border-il-neutral-90 py-3.5 text-sm font-semibold text-il-neutral-50 hover:bg-il-bg-grey-tint"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddLeadContent() {
  const { token, refresh } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      await createLead(token, name, phone);
      setSavedName(name.trim());
      setName("");
      setPhone("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save lead");
    } finally {
      setLoading(false);
    }
  }

  if (savedName) {
    return (
      <>
        <MobileSuccessCard
          savedName={savedName}
          onAddAnother={() => setSavedName(null)}
        />
        <div className="hidden lg:block">
          <SplitPanelLayout>
            <SuccessScreen
              title="Lead added!"
              message={`${savedName} has been saved as unverified. We'll verify the lead shortly.`}
              primaryLabel="Add another lead"
              primaryTo="/leads/new"
              onPrimaryClick={() => setSavedName(null)}
              secondaryLabel="Back to home"
              secondaryTo="/dashboard"
            />
          </SplitPanelLayout>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="il-mobile-login-bg flex min-h-screen flex-col px-4 pb-28 pt-14 lg:hidden">
        <MobileHomeHeader title="Add Lead" onBack={() => navigate(-1)} />

        <div className="rounded-[20px] bg-white px-5 py-6 shadow-[0_4px_20px_rgba(1,47,99,0.12)]">
          <h1 className="text-xl font-bold text-il-neutral-10">Add Lead</h1>
          <p className="mt-1.5 text-sm text-il-neutral-50">
            Enter the student&apos;s name and phone number.
          </p>

          <div className="mt-6">
            <AddLeadForm
              formId="add-lead-mobile"
              name={name}
              phone={phone}
              error={error}
              onNameChange={setName}
              onPhoneChange={setPhone}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 lg:hidden">
          <button
            type="submit"
            form="add-lead-mobile"
            disabled={loading || !name.trim() || phone.length < 10}
            className="w-full rounded-full bg-white py-4 text-sm font-semibold text-il-blue-30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save Lead"}
          </button>
        </div>
      </div>

      <div className="hidden lg:block">
        <SplitPanelLayout>
          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-5 py-8 sm:px-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 text-sm font-medium text-il-blue-30"
              >
                ← Back
              </button>

              <h1 className="text-2xl font-bold text-il-text-primary">Add Lead</h1>
              <p className="mt-2 text-sm text-il-text-secondary">
                Enter the student&apos;s name and phone number.
              </p>

              <div className="mt-8">
                <AddLeadForm
                  formId="add-lead-desktop"
                  name={name}
                  phone={phone}
                  error={error}
                  onNameChange={setName}
                  onPhoneChange={setPhone}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            <div className="border-t border-il-neutral-90 bg-white px-5 py-4 sm:px-10">
              <button
                type="submit"
                form="add-lead-desktop"
                disabled={loading || !name.trim() || phone.length < 10}
                className="w-full rounded-xl bg-il-blue-30 py-4 text-sm font-semibold text-white hover:bg-il-blue-20 disabled:opacity-50"
              >
                {loading ? "Saving…" : "Save Lead"}
              </button>
            </div>
          </div>
        </SplitPanelLayout>
      </div>
    </>
  );
}

export function AddLeadPage() {
  return (
    <AuthGuard>
      <AddLeadContent />
    </AuthGuard>
  );
}
