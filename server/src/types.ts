export type LeadStatus = "unverified" | "verified" | "rejected";

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

export interface Lead {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  volunteer_email: string;
  student_name: string;
  student_phone: string;
  status: LeadStatus;
  verified_at: string | null;
  created_at: string;
}

export interface RunnerLeadStats {
  volunteer_id: string;
  volunteer_name: string;
  volunteer_email: string;
  total_leads: number;
  verified_leads: number;
  unverified_leads: number;
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

export interface MilestoneEvent {
  id: string;
  user_id: string;
  milestone_number: number;
  verified_count_at_trigger: number;
  acknowledged: boolean;
  created_at: string;
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

export interface DbSchema {
  users: Record<string, UserRecord>;
  leads: Lead[];
  wallet_items: WalletItem[];
  milestone_events: MilestoneEvent[];
}
