import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Admin_Authenticate",
      email: "admin.authenticate@test.com.br",
      password: "@dmin"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin.authenticate@test.com.br",
      password: "@dmin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("id");
  });
});
