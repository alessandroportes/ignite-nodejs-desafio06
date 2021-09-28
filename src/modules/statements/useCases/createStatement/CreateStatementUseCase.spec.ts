import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Should be able possible to do a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "User FAKE",
      email: "user@test.com",
      password: "passFake",
    });

    const statement = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Description DEPOSIT",
    } as ICreateStatementDTO;

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty("id");
  });

  it("Should not be able possible to do a deposit with a not existing user", async () => {
    expect(async () => {
      const statement = {
        user_id: "userFake",
        type: "deposit",
        amount: 50,
        description: "Deposit Not User",
      } as ICreateStatementDTO;

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be possible to make a withdrawal when you have enough balance available", async () => {
    const user = await createUserUseCase.execute({
      name: "User FAKE",
      email: "user@test.com",
      password: "passFake",
    });

    const statement = {
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Description DEPOSIT",
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(statement);

    const withdraw = {
      user_id: user.id,
      type: "withdraw",
      amount: 50,
      description: "WithDraw Negative",
    } as ICreateStatementDTO;

    const result = await createStatementUseCase.execute(withdraw);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("amount");
  });

  it("Should not be able possible to do a withdraw without enough money in the account", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User FAKE",
        email: "user@test.com",
        password: "passFake",
      });

      const statement = {
        user_id: user.id,
        type: "deposit",
        amount: 100,
        description: "Description DEPOSIT",
      } as ICreateStatementDTO;

      await createStatementUseCase.execute(statement);

      const withdraw = {
        user_id: user.id,
        type: "withdraw",
        amount: 200,
        description: "WithDraw Negative",
      } as ICreateStatementDTO;

      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(AppError);
  });
});
