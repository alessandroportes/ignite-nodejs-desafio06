import { Connection } from "typeorm";
import request from "supertest";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "123",
    });
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "123",
    });
    expect(response.status).toBe(200);
  });

  it("Should not be able to authenticate user with password or username incorrect", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test 2",
      email: "user2@test.com",
      password: "123",
    });
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user2@test.com",
      password: "123f",
    });
    expect(response.status).toBe(401);
  });
});
