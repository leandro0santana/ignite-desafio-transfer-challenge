import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Show User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user by id", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Admin_Show",
      email: "admin.show@test.com.br",
      password: "@dmin"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin.show@test.com.br",
      password: "@dmin",
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("Admin_Show");
  });
});
