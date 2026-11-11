import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { HarvestNote } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("HarvestNote Smart Contract", function () {
  let harvestNote: HarvestNote;
  let owner: SignerWithAddress;
  let farmer1: SignerWithAddress;
  let farmer2: SignerWithAddress;

  beforeEach(async function () {
    [owner, farmer1, farmer2] = await ethers.getSigners();
    const HarvestNoteFactory = await ethers.getContractFactory("HarvestNote");
    harvestNote = (await HarvestNoteFactory.deploy()) as HarvestNote;
    await harvestNote.waitForDeployment();
  });

  describe("A. Harvest Creation", function () {
    it("should successfully create a harvest and emit HarvestAdded event", async function () {
      const tx = await harvestNote
        .connect(farmer1)
        .addHarvest("Heirloom Tomatoes", 450, "kg", "2026-11-10");

      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);

      // Verify event emission
      await expect(tx)
        .to.emit(harvestNote, "HarvestAdded")
        .withArgs(1, farmer1.address, "Heirloom Tomatoes", 450, "kg", "2026-11-10", (await ethers.provider.getBlock("latest"))?.timestamp);

      // Check total harvest count
      expect(await harvestNote.getTotalHarvestCount()).to.equal(1);

      // Check harvest details
      const harvest = await harvestNote.getHarvest(1);
      expect(harvest.id).to.equal(1);
      expect(harvest.cropName).to.equal("Heirloom Tomatoes");
      expect(harvest.quantity).to.equal(450);
      expect(harvest.unit).to.equal("kg");
      expect(harvest.harvestDate).to.equal("2026-11-10");
      expect(harvest.farmer).to.equal(farmer1.address);
      expect(harvest.exists).to.be.true;
    });

    it("should reject harvest creation with empty crop name", async function () {
      await expect(
        harvestNote.connect(farmer1).addHarvest("", 100, "kg", "2026-11-10")
      ).to.be.revertedWith("Crop name cannot be empty");
    });

    it("should reject harvest creation with zero quantity", async function () {
      await expect(
        harvestNote.connect(farmer1).addHarvest("Wheat", 0, "bags", "2026-11-10")
      ).to.be.revertedWith("Quantity must be greater than zero");
    });

    it("should reject harvest creation with empty unit", async function () {
      await expect(
        harvestNote.connect(farmer1).addHarvest("Golden Corn", 50, "", "2026-11-10")
      ).to.be.revertedWith("Unit cannot be empty");
    });

    it("should reject harvest creation with empty harvest date", async function () {
      await expect(
        harvestNote.connect(farmer1).addHarvest("Carrots", 25, "baskets", "")
      ).to.be.revertedWith("Harvest date cannot be empty");
    });
  });

  describe("B. Harvest Retrieval", function () {
    beforeEach(async function () {
      await harvestNote.connect(farmer1).addHarvest("Apples", 120, "crates", "2026-11-01");
      await harvestNote.connect(farmer1).addHarvest("Pears", 80, "crates", "2026-11-03");
      await harvestNote.connect(farmer2).addHarvest("Barley", 500, "bags", "2026-11-05");
    });

    it("should retrieve total harvest count correctly", async function () {
      expect(await harvestNote.getTotalHarvestCount()).to.equal(3);
    });

    it("should retrieve all harvest IDs", async function () {
      const ids = await harvestNote.getAllHarvestIds();
      expect(ids.length).to.equal(3);
      expect(ids[0]).to.equal(1);
      expect(ids[1]).to.equal(2);
      expect(ids[2]).to.equal(3);
    });

    it("should retrieve harvests belonging to a specific wallet", async function () {
      const farmer1Ids = await harvestNote.getHarvestsByFarmer(farmer1.address);
      expect(farmer1Ids.length).to.equal(2);
      expect(farmer1Ids[0]).to.equal(1);
      expect(farmer1Ids[1]).to.equal(2);

      const farmer2Ids = await harvestNote.getHarvestsByFarmer(farmer2.address);
      expect(farmer2Ids.length).to.equal(1);
      expect(farmer2Ids[0]).to.equal(3);
    });

    it("should retrieve all harvests in one call using getAllHarvests helper", async function () {
      const all = await harvestNote.getAllHarvests();
      expect(all.length).to.equal(3);
      expect(all[0].cropName).to.equal("Apples");
      expect(all[1].cropName).to.equal("Pears");
      expect(all[2].cropName).to.equal("Barley");
    });

    it("should retrieve farmer harvests using getFarmerHarvests helper", async function () {
      const f1Harvests = await harvestNote.getFarmerHarvests(farmer1.address);
      expect(f1Harvests.length).to.equal(2);
      expect(f1Harvests[0].cropName).to.equal("Apples");
      expect(f1Harvests[1].cropName).to.equal("Pears");
    });

    it("should reject retrieval of non-existent harvest ID", async function () {
      await expect(harvestNote.getHarvest(999)).to.be.revertedWith("Harvest does not exist");
    });
  });

  describe("C. Harvest Update", function () {
    beforeEach(async function () {
      await harvestNote.connect(farmer1).addHarvest("Strawberries", 40, "baskets", "2026-11-08");
    });

    it("should allow original farmer to update their record and emit HarvestUpdated event", async function () {
      const tx = await harvestNote
        .connect(farmer1)
        .updateHarvest(1, "Organic Strawberries", 55, "baskets", "2026-11-09");

      await expect(tx)
        .to.emit(harvestNote, "HarvestUpdated")
        .withArgs(1, farmer1.address, "Organic Strawberries", 55, "baskets", "2026-11-09", (await ethers.provider.getBlock("latest"))?.timestamp);

      const updated = await harvestNote.getHarvest(1);
      expect(updated.cropName).to.equal("Organic Strawberries");
      expect(updated.quantity).to.equal(55);
      expect(updated.harvestDate).to.equal("2026-11-09");
    });

    it("should reject update by unauthorized user", async function () {
      await expect(
        harvestNote
          .connect(farmer2)
          .updateHarvest(1, "Hacked Strawberries", 100, "baskets", "2026-11-09")
      ).to.be.revertedWith("Only farmer can modify record");
    });

    it("should reject update of invalid harvest ID", async function () {
      await expect(
        harvestNote
          .connect(farmer1)
          .updateHarvest(999, "Strawberries", 50, "baskets", "2026-11-09")
      ).to.be.revertedWith("Harvest does not exist");
    });

    it("should reject update with empty crop name", async function () {
      await expect(
        harvestNote.connect(farmer1).updateHarvest(1, "", 50, "baskets", "2026-11-09")
      ).to.be.revertedWith("Crop name cannot be empty");
    });

    it("should reject update with zero quantity", async function () {
      await expect(
        harvestNote.connect(farmer1).updateHarvest(1, "Strawberries", 0, "baskets", "2026-11-09")
      ).to.be.revertedWith("Quantity must be greater than zero");
    });

    it("should reject update with empty unit", async function () {
      await expect(
        harvestNote.connect(farmer1).updateHarvest(1, "Strawberries", 50, "", "2026-11-09")
      ).to.be.revertedWith("Unit cannot be empty");
    });

    it("should reject update with empty harvest date", async function () {
      await expect(
        harvestNote.connect(farmer1).updateHarvest(1, "Strawberries", 50, "baskets", "")
      ).to.be.revertedWith("Harvest date cannot be empty");
    });
  });

  describe("D. Harvest Deletion", function () {
    beforeEach(async function () {
      await harvestNote.connect(farmer1).addHarvest("Potatoes", 300, "kg", "2026-11-01");
      await harvestNote.connect(farmer1).addHarvest("Onions", 150, "kg", "2026-11-02");
    });

    it("should allow original farmer to delete their record and emit HarvestDeleted event", async function () {
      expect(await harvestNote.getTotalHarvestCount()).to.equal(2);

      const tx = await harvestNote.connect(farmer1).deleteHarvest(1);

      await expect(tx)
        .to.emit(harvestNote, "HarvestDeleted")
        .withArgs(1, farmer1.address, (await ethers.provider.getBlock("latest"))?.timestamp);

      expect(await harvestNote.getTotalHarvestCount()).to.equal(1);

      // Retrieval of deleted harvest should revert
      await expect(harvestNote.getHarvest(1)).to.be.revertedWith("Harvest does not exist");

      // Global IDs should only have ID 2 left
      const remainingGlobalIds = await harvestNote.getAllHarvestIds();
      expect(remainingGlobalIds.length).to.equal(1);
      expect(remainingGlobalIds[0]).to.equal(2);

      // Farmer IDs should only have ID 2 left
      const farmerIds = await harvestNote.getHarvestsByFarmer(farmer1.address);
      expect(farmerIds.length).to.equal(1);
      expect(farmerIds[0]).to.equal(2);
    });

    it("should reject deletion by unauthorized user", async function () {
      await expect(
        harvestNote.connect(farmer2).deleteHarvest(1)
      ).to.be.revertedWith("Only farmer can modify record");
    });

    it("should reject deletion of non-existent or already deleted harvest ID", async function () {
      await expect(
        harvestNote.connect(farmer1).deleteHarvest(999)
      ).to.be.revertedWith("Harvest does not exist");

      // Delete id 1 then try to delete again
      await harvestNote.connect(farmer1).deleteHarvest(1);
      await expect(
        harvestNote.connect(farmer1).deleteHarvest(1)
      ).to.be.revertedWith("Harvest does not exist");
    });
  });
});

