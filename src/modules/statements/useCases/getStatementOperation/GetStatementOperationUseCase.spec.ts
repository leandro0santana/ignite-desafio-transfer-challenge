import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able list statement by id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Teste Statement",
      email: "test@statement.com",
      password: "Test"
    });

    const { id } = await inMemoryStatementsRepository.create({
      user_id: !user.id ? "" : user.id,
      description: "Statement description Test",
      amount: 400,
      type: "deposit" as OperationType,
    });

    const statement = await getStatementOperationUseCase.execute({
      statement_id: !id ? "" : id,
      user_id: !user.id ? "" : user.id
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able list statement with invalid id", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Teste Statement",
        email: "test@statement.com",
        password: "Test"
      });

      await getStatementOperationUseCase.execute({
        statement_id: "statement-now-existent",
        user_id: !user.id ? "" : user.id
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able list statement to a now-existent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user-now-existent",
        statement_id: "123456"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
