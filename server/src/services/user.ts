import { HydratedDocument } from "mongoose";
import { IBulkUpdate, IBulkUpdateIds, IBulkUpdatePayload, ICreateUser, IEditUser, IUserDoc } from "../interfaces/user";
import USER from "../models/user";

/**
 * Create an user
 * @param payload
 * @returns
 */
export const createUser = async (payload: ICreateUser) => {
  try {
    const user = await USER.findOne({
      isDeleted: { $ne: true },
      email: payload.email,
    });
    if (user) throw "Email is already in use.";

    return await USER.create(payload);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users
 * @param page
 * @param limit
 * @returns
 */
export const getUsers = async ({
  limit = 10,
  page = 1,
  field = null,
  search = null,
}) => {
  try {
    let skip = 0;

    if (page != 1) skip = (+page - 1) * +limit;

    const query: any = { isDeleted: { $ne: true } };
    if (field && search) {
      query[field] = new RegExp(search, "i");
    }

    const count = await USER.countDocuments(query);
    const users = await USER.find(query, "-__v -createdAt -updatedAt")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    return { page, pageSize: limit, total: count, users };
  } catch (error) {
    throw error;
  }
};

/**
 * Get User by ID
 * @param param0
 */
export const getUserByID = async (_id: string) => {
  try {
    const user = await USER.findOne(
      { _id, isDeleted: { $ne: true } },
      "-__v -createdAt -updatedAt"
    );
    if (!user) throw `User is not found with given ID ${_id}.`;

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Edit User
 * @param user
 * @param payload
 * @returns
 */
export const editUser = async (
  user: IUserDoc,
  payload: IEditUser
) => {
  try {
    if (payload.email) {
      const checkEmail = await USER.findOne({
        _id: { $ne: user._id },
        isDeleted: { $ne: true },
        email: payload.email,
      });
      if (checkEmail) throw "Email is already in use.";
    }

    user.firstName = payload.firstName ?? user.firstName;
    user.lastName = payload.lastName ?? user.lastName;
    user.phoneNo = payload.phoneNo ?? user.phoneNo;
    user.email = payload.email ?? user.email;
    user.status = payload.status ?? user.status;

    return await user.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete User
 * @param param0
 */
export const deleteUser = async (user: IUserDoc) => {
  try {
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Edit User
 * @param id
 */
export const bulkUpdateUser = async (reqQuery: IBulkUpdate, userIds: IBulkUpdateIds) => {
  try {
    let updatePayload: IBulkUpdatePayload = {};
    if (reqQuery.status) {
      updatePayload.status = reqQuery.status;
    } else if (reqQuery.isDeleted) {
      updatePayload.isDeleted = reqQuery.isDeleted;
      updatePayload.deletedAt = new Date();
    }

    await USER.updateMany(
      {
        _id: [...userIds.ids],
        isDeleted: { $ne: true },
      },
      {
        $set: updatePayload,
      },
      { new: true }
    );

    return true;
  } catch (error) {
    throw error;
  }
};
