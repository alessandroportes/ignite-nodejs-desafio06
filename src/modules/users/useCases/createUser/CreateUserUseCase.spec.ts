import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "user test",
      email: "user@test.com",
      password: "user",
    };

    await createUserUseCase.execute(user);

    const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("Should not be able to create a new user with the same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user test",
        email: "user@test.com",
        password: "user",
      });
      await createUserUseCase.execute({
        name: "user test",
        email: "user@test.com",
        password: "user",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
