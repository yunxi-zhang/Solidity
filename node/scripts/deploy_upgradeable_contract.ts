import { ethers, upgrades } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const CONTRACT_DEPLOYMENT_LOGS = "contractDeploymentLog.json";
  const contractNames = ["Box", "RBAC"];

  if (contractNames.length == 0) {
    console.log(
      "No contract names detected, please add at least one contract name to the contractNames."
    );
  } else {
    const logDir = path.join(__dirname, "../contractLogs/");
    const contractDeploymentLogFilePath = logDir + CONTRACT_DEPLOYMENT_LOGS;
    const currentContractDeploymentLogs = JSON.parse(
      fs.readFileSync(contractDeploymentLogFilePath, "utf-8")
    );
    // Compare contractNames against the existing contract deploy logs to find out which contract has not been deployed once yet
    for (let i = 0; i < currentContractDeploymentLogs.length; i++) {
      for (let j = 0; j < contractNames.length; j++) {
        if (contractNames[j] == currentContractDeploymentLogs[i].contract) {
          const index = contractNames.indexOf(contractNames[j]);
          contractNames.splice(index, 1);
          break;
        }
      }
    }

    // If the above comparision finds out any contract(s) that has/have not been deployed for once yet, deploy it/them
    if (contractNames.length > 0) {
      const [deployer] = await ethers.getSigners();
      console.log("Deploying contracts with the account:", deployer.address);
      const promises = contractNames.map(async (contratName) => {
        const contract = await ethers.getContractFactory(contratName);
        const contractInstance = await upgrades.deployProxy(
          contract,
          [deployer.address],
          {
            initializer: "initialize",
          }
        );
        await contractInstance.waitForDeployment();
        console.log(
          "contract",
          contratName,
          "deployed to:",
          contractInstance.target
        );

        const timeStamp = Date.now();
        const date = new Date(timeStamp);
        console.log("timeStamp:", timeStamp);
        console.log("date:", date);
        const contractDeploymentLogs = {
          contract: contratName,
          address: contractInstance.target,
          timeStamp: timeStamp,
          humanReadableTimeStamp: date,
        };
        return contractDeploymentLogs;
      });

      const contractDeploymentLogs = await Promise.all(promises);
      contractDeploymentLogs.forEach((newLogs) => {
        currentContractDeploymentLogs.push(newLogs);
      });
      const newContractDeploymentLogs = currentContractDeploymentLogs;
      const writer = fs.createWriteStream(logDir + CONTRACT_DEPLOYMENT_LOGS);
      await writer.write(JSON.stringify(newContractDeploymentLogs));
    } else {
      console.log(
        "All the contracts have been deployed once, please run the upgrade.js to upgrade all the contracts"
      );
    }
  }
}

main();