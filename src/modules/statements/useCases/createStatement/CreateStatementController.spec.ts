import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit", async () => {
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

    const response = await request(app).post("/api/v1/statements/deposit").send({
      description: "Statement description Test",
      amount: 400,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.description).toEqual("Statement description Test");
  });

  it("should be able to create a new withdraw", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      description: "Statement description Test",
      amount: 300,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toEqual(300);
  });

  it("should not be able to create a new withdraw with insufficient funds", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      description: "Statement description Test",
      amount: 300,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
  });
});
