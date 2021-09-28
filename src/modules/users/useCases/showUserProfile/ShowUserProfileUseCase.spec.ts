import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("List User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("Should be list user profile", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User Test",
      email: "user@test.com",
      password: "123",
    });

    const user_id = await showUserProfileUseCase.execute(user.id);

    expect(user).toEqual(user_id);
  });

  it("Should be not list user profile is incorrect id", async () => {
    expect(async () => {
      const user_id = await showUserProfileUseCase.execute("id_fake");
    }).rejects.toBeInstanceOf(AppError);
  });
});
