import { Router } from "express";
import fungibleToken from "../business/FungibleToken";
export const tokenRoute = Router();

tokenRoute.get("/fungibleToken/balance/:account", async (req, res) => {
  const account = req.params.account;
  const balance: any = await fungibleToken.getBalance(account); 
  const response = {
    "balance": balance
  }
  res.send(response);
});

tokenRoute.post("/fungibleToken/transfer", async (req, res) => {
  const targetAccount = req.body.targetAccount;
  const amount = req.body.amount;
  const txResponse = await fungibleToken.transfer(targetAccount, amount);
  res.send(txResponse);
});