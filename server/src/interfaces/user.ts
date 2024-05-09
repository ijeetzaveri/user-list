import { Document, Types } from "mongoose";

export interface IBulkUpdatePayload {
  status?: String;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
}

export interface IEditUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  status?: string;
}

export interface IUserDoc extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  status: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface IBulkUpdate {
  status?: string;
  isDeleted?: boolean;
}

export interface IBulkUpdateIds {
  ids: [string]
}
