import { Schema, model } from "mongoose";
import { STATUS } from "../utils/enum";

const UserSchema = new Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    phoneNo: { type: String, default: null },
    status: {
      type: String,
      default: STATUS.ACTIVE,
      enum: [...Object.values(STATUS)],
    },
    isDeleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, default: null, select: false },
  },
  {
    timestamps: true,
  }
);

export default model("user", UserSchema, "users");
