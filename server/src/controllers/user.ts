import { Request, RequestHandler, Response } from "express";

import {
  bulkUpdateUser,
  createUser,
  deleteUser,
  editUser,
  getUserByID,
  getUsers,
} from "../services/user";

/**
 * Create an user
 * @param req
 * @param res
 * @returns
 */
export const create: RequestHandler = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const data = await createUser(payload);

    return res.status(201).json({
      status: true,
      message: "Create an User successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error ?? "Something went wrong while creating an user..!",
    });
  }
};

/**
 * Get all users
 * @param req
 * @param res
 * @returns
 */
export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const reqQuery = req.query;
    const data = await getUsers(reqQuery);

    return res.status(200).json({
      status: true,
      message: "Get Users successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error ?? "Something went wrong while getting users..!",
    });
  }
};

/**
 * Get user by ID
 * @param req
 * @param res
 * @returns
 */
export const getById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await getUserByID(id);

    return res.status(200).json({
      status: true,
      message: "Get User by ID successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error ?? "Something went wrong while getting users..!",
    });
  }
};

/**
 * Edit user
 * @param req
 * @param res
 * @returns
 */
export const edit: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const user = await getUserByID(id);

    const data = await editUser(user, payload);

    return res.status(200).json({
      status: true,
      message: "Update user successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error ?? "Something went wrong while editing users..!",
    });
  }
};

/**
 * Delete user
 * @param req
 * @param res
 * @returns
 */
export const deleteByID: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const user = await getUserByID(id);

    await deleteUser(user);

    return res.status(200).json({
      status: true,
      message: "Delete user successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error ?? "Something went wrong while editing users..!",
    });
  }
};

/**
 * Bulk update
 * @param req
 * @param res
 * @returns
 */
export const bulkUpdate: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const reqQuery = req.query;
    const payload = req.body;

    await Promise.all(
      payload.ids.map(async (id: string) => {
        return await getUserByID(id);
      })
    );

    await bulkUpdateUser(reqQuery, payload);

    return res.status(200).json({
      status: true,
      message: "Update user in bulk successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error ?? "Something went wrong while editing users..!",
    });
  }
};
