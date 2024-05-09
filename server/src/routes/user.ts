import { Router } from "express";
import {
  bulkUpdate,
  create,
  deleteByID,
  edit,
  getAll,
  getById,
} from "../controllers/user";
import { validate } from "express-validation";
import {
  BulkUpdateDto,
  CreateUserDto,
  EditUserDto,
  GetUserByIDDto,
  GetUsersDto,
} from "../validation/user";

const router = Router();

router.put(
  "/bulkUpdate",
  validate(
    BulkUpdateDto,
    { context: true, keyByField: true, statusCode: 422 },
    { abortEarly: true }
  ),
  bulkUpdate
);

router.post(
  "/",
  validate(
    CreateUserDto,
    { context: true, keyByField: true, statusCode: 422 },
    { abortEarly: true }
  ),
  create
);

router.get(
  "/",
  validate(
    GetUsersDto,
    { context: true, keyByField: true, statusCode: 422 },
    { abortEarly: true }
  ),
  getAll
);

router.get(
  "/:id",
  validate(
    GetUserByIDDto,
    { context: true, keyByField: true, statusCode: 422 },
    { abortEarly: true }
  ),
  getById
);

router.put(
  "/:id",
  validate(
    EditUserDto,
    { context: true, keyByField: true, statusCode: 422 },
    { abortEarly: true }
  ),
  edit
);

router.delete(
  "/:id",
  validate(
    GetUserByIDDto,
    { context: true, keyByField: true, statusCode: 422 },
    { abortEarly: true }
  ),
  deleteByID
);

export default router;
