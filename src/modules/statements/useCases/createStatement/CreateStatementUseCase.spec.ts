import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Teste Statement",
      email: "test@statement.com",
      password: "Test"
    })

    const statement = await createStatementUseCase.execute({
      user_id: !user.id ? "" : user.id,
      description: "Statement description Test",
      amount: 400,
      type: "deposit" as OperationType,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new withdraw with insufficient funds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Teste Statement",
        email: "test@statement.com",
        password: "Test"
      })

      await createStatementUseCase.execute({
        user_id: !user.id ? "" : user.id,
        description: "Statement description Test",
        amount: 500,
        type: "withdraw" as OperationType,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new statement to a now-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user-now-existent",
        description: "Statement description Test",
        amount: 500,
        type: "deposit" as OperationType,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
