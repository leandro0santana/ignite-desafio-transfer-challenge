import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Admin",
      email: "admin@test.com.br",
      password: "@dmin"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com.br",
      password: "@dmin",
    });

    const { token } = responseToken.body;

    const statement = await request(app).post("/api/v1/statements/deposit").send({
      description: "Statement description Test",
      amount: 400,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/api/v1/statements/${statement}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
