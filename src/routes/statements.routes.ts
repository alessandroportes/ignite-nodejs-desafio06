import { Router } from "express";

import { CreateStatementController } from "../modules/statements/useCases/createStatement/CreateStatementController";
import { GetBalanceController } from "../modules/statements/useCases/getBalance/GetBalanceController";
import { GetStatementOperationController } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";
import { TransferValueController } from "../modules/statements/useCases/transferValue/TransferValueController";

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const transferValueController = new TransferValueController();

statementRouter.use(ensureAuthenticated);

statementRouter.get("/balance", getBalanceController.execute);
statementRouter.post("/deposit", createStatementController.execute);
statementRouter.post("/withdraw", createStatementController.execute);
statementRouter.post("/transfers/:user_id", transferValueController.execute);
statementRouter.get("/:statement_id", getStatementOperationController.execute);

export { statementRouter };
