import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      name: "User FAKE",
      email: "user@test.com",
      password: "passFake",
    });

    const result = await getBalanceUseCase.execute({ user_id: user.id });

    expect(result).toHaveProperty("statement");
    expect(result).toHaveProperty("balance");
  });

  it("Should not be able to get balance", async () => {
    expect(async () => {
      const user_id = "UserFake";
      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(AppError);
  });
});
