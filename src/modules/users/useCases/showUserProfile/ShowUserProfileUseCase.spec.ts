import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository,
    );
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
  });

  it("should be able to show user by id", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "TestPassword"
    });

    const user_id = !user.id ? "" : user.id

    const showUser = await showUserProfileUseCase.execute(user_id);

    expect(showUser).toHaveProperty("name");
    expect(showUser).toHaveProperty("email");
  });

  it("should not be able to show user with nonexistent id", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123456");
    }).rejects.toBeInstanceOf(AppError);
  });
});
