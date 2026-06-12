import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    firebase_uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    full_name: { type: String, required: true },
    photo_url: { type: String, default: null },
    verified_lead_count: { type: Number, default: 0 },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
  },
  { versionKey: false },
);

const leadSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    volunteer_id: { type: String, required: true, index: true },
    volunteer_name: { type: String, required: true, index: true },
    volunteer_email: { type: String, required: true, index: true },
    student_name: { type: String, required: true },
    student_phone: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: "unverified" },
    verified_at: { type: Date, default: null },
    created_at: { type: Date, required: true },
  },
  { versionKey: false },
);

const walletItemSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, index: true },
    milestone_event_id: { type: String, required: true, unique: true },
    reward_type: { type: String, required: true },
    coupon_code: { type: String, required: true },
    coupon_value: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    earned_at: { type: Date, required: true },
    milestone_number: { type: Number, required: true },
  },
  { versionKey: false },
);

const milestoneEventSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, index: true },
    milestone_number: { type: Number, required: true },
    verified_count_at_trigger: { type: Number, required: true },
    acknowledged: { type: Boolean, default: false },
    created_at: { type: Date, required: true },
  },
  { versionKey: false },
);

milestoneEventSchema.index({ user_id: 1, milestone_number: 1 }, { unique: true });

export const UserModel = mongoose.model("User", userSchema);
export const LeadModel = mongoose.model("Lead", leadSchema);
export const WalletItemModel = mongoose.model("WalletItem", walletItemSchema);
export const MilestoneEventModel = mongoose.model("MilestoneEvent", milestoneEventSchema);
