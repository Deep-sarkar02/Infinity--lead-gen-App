import { Link } from "react-router-dom";

interface SuccessScreenProps {
  title: string;
  message: string;
  primaryLabel: string;
  primaryTo: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  secondaryTo?: string;
  onSecondaryClick?: () => void;
}

export function SuccessScreen({
  title,
  message,
  primaryLabel,
  primaryTo,
  onPrimaryClick,
  secondaryLabel,
  secondaryTo,
  onSecondaryClick,
}: SuccessScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-il-blue-30 text-white shadow-elevated">
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-bold text-il-text-primary">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-il-text-secondary">{message}</p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        {onPrimaryClick ? (
          <button
            type="button"
            onClick={onPrimaryClick}
            className="w-full rounded-xl bg-il-blue-30 py-3.5 text-sm font-semibold text-white hover:bg-il-blue-20"
          >
            {primaryLabel}
          </button>
        ) : (
          <Link
            to={primaryTo}
            className="w-full rounded-xl bg-il-blue-30 py-3.5 text-sm font-semibold text-white hover:bg-il-blue-20"
          >
            {primaryLabel}
          </Link>
        )}
        {(secondaryLabel && (secondaryTo || onSecondaryClick)) && (
          onSecondaryClick ? (
            <button
              type="button"
              onClick={onSecondaryClick}
              className="w-full rounded-xl border border-il-neutral-90 py-3.5 text-sm font-semibold text-il-text-secondary hover:bg-il-bg-grey-tint"
            >
              {secondaryLabel}
            </button>
          ) : (
            <Link
              to={secondaryTo!}
              className="w-full rounded-xl border border-il-neutral-90 py-3.5 text-sm font-semibold text-il-text-secondary hover:bg-il-bg-grey-tint"
            >
              {secondaryLabel}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
