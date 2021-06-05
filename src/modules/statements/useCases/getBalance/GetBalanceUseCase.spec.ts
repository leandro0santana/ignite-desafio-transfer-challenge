import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able list balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Teste Statement",
      email: "test@statement.com",
      password: "Test"
    })

    const balance = await getBalanceUseCase.execute({
      user_id: !user.id ? "" : user.id,
    });

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able list balance to a now-existent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user-now-existent",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
