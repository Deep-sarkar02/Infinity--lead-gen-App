export interface MilestoneProgress {
  verifiedCount: number;
  targetCount: number;
  progressPct: number;
  remaining: number;
  milestoneComplete: boolean;
}

function getNextMilestoneTarget(verified: number): number {
  if (verified === 0) return 100;
  if (verified % 100 === 0) return verified + 100;
  return Math.ceil(verified / 100) * 100;
}

/** Progress within the current 100-lead leg (resets to 0% when a milestone is hit). */
function getProgressWithinCurrentLeg(verified: number): number {
  if (verified === 0) return 0;
  const legStart = Math.floor(verified / 100) * 100;
  return Math.min(100, Math.round(((verified - legStart) / 100) * 100));
}

/**
 * First leg: 0–99 → x/100. At 100 → milestone, then opens x/200 from 0%.
 * Second leg: 101–199 → x/200. At 200 → milestone, then opens x/300 from 0%, etc.
 */
export function getMilestoneProgress(verified: number): MilestoneProgress {
  const verifiedCount = Math.max(0, verified);
  const targetCount = getNextMilestoneTarget(verifiedCount);
  const progressPct = getProgressWithinCurrentLeg(verifiedCount);
  const remaining = Math.max(0, targetCount - verifiedCount);
  const milestoneComplete = verifiedCount > 0 && verifiedCount % 100 === 0;

  return {
    verifiedCount,
    targetCount,
    progressPct,
    remaining,
    milestoneComplete,
  };
}

function leadWord(count: number): string {
  return count === 1 ? "lead" : "leads";
}

export function getRewardSubtitle(progress: MilestoneProgress): string {
  const { remaining, progressPct } = progress;
  if (remaining <= 5) {
    return `So close! Just ${remaining} verified ${leadWord(remaining)} to go.`;
  }
  if (progressPct >= 75) {
    return `Almost there! ${remaining} verified ${leadWord(remaining)} to your coupon.`;
  }
  if (progress.milestoneComplete) {
    return `${remaining} more verified ${leadWord(remaining)} for your next Amazon coupon.`;
  }
  return `${remaining} more verified ${leadWord(remaining)} to unlock your Amazon coupon.`;
}

export function getRewardSubtitleShort(progress: MilestoneProgress): string {
  const { remaining, progressPct } = progress;
  if (remaining <= 5) {
    return `So close — ${remaining} to go!`;
  }
  if (progressPct >= 75) {
    return `Almost there — ${remaining} more!`;
  }
  if (progress.milestoneComplete) {
    return `${remaining} more for your next coupon`;
  }
  return `${remaining} more to unlock your coupon`;
}
