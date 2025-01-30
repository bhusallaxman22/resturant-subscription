import request from "supertest";
import app from "../index";
import { User } from "../models/User.model";

describe("Role-Based Access Control", () => {
  let adminToken, userToken;

  beforeAll(async () => {
    // Create test users
    const admin = await User.create({
      /* admin credentials */
    });
    const user = await User.create({
      /* user credentials */
    });

    // Get tokens
    adminToken = await getAuthToken(admin);
    userToken = await getAuthToken(user);
  });

  test("Admin should access protected route", async () => {
    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  test("User should be denied admin route", async () => {
    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
});
