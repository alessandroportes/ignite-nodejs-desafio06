import { Connection } from "typeorm";
import request from "supertest";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Show Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to list profile user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "123",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "123",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .send()
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toBe(200);
  });

  it("Should not be able to list profile for an invalid user ", async () => {
    const token = "testetoken";

    const response = await request(app)
      .get("/api/v1/profile")
      .send()
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toBe(401);
  });
});
