export type LeadStatus = "unverified" | "verified" | "rejected";

export interface LeadRecord {
  id: string;
  student_name: string;
  student_phone: string;
  status: LeadStatus;
  verified_at: string | null;
  created_at: string;
}

export interface UserRecord {
  id: string;
  firebase_uid: string;
  email: string;
  full_name: string;
  photo_url: string | null;
  verified_lead_count: number;
  created_at: string;
  updated_at: string;
}

export interface WalletItem {
  id: string;
  user_id: string;
  milestone_event_id: string;
  reward_type: "amazon_coupon";
  coupon_code: string;
  coupon_value: string;
  status: "active" | "redeemed" | "expired";
  earned_at: string;
  milestone_number: number;
}

export interface LeadSummary {
  verified: number;
  unverified: number;
  total: number;
}

export interface PendingMilestone {
  id: string;
  verified_count: number;
  milestone_number: number;
  reward: {
    type: string;
    value: string;
    preview: string;
  };
}
