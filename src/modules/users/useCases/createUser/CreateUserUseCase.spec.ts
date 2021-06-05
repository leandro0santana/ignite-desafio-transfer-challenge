import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUsertUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUsertUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
  });

  it("should be able to create a new user", async () => {
    const user = await createUsertUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "TestPassword"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with email exists", async () => {
    expect(async () => {
      await createUsertUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "TestPassword"
      });

      await createUsertUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "TestPassword"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
