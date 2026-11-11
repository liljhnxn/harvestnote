import { Abi } from "viem";

export const HARVESTNOTE_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_HARVESTNOTE_CONTRACT_ADDRESS ||
  "0x68eBC7E0D6257EB5770015aF1d94d10c34F8dA2d") as `0x${string}`;

export interface HarvestRecord {
  id: bigint;
  cropName: string;
  quantity: bigint;
  unit: string;
  harvestDate: string;
  farmer: `0x${string}`;
  createdAt: bigint;
  exists: boolean;
}

export const HARVESTNOTE_ABI = [
  {
    type: "function",
    name: "addHarvest",
    inputs: [
      { name: "cropName", type: "string" },
      { name: "quantity", type: "uint256" },
      { name: "unit", type: "string" },
      { name: "harvestDate", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateHarvest",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "cropName", type: "string" },
      { name: "quantity", type: "uint256" },
      { name: "unit", type: "string" },
      { name: "harvestDate", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deleteHarvest",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllHarvestIds",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHarvest",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "cropName", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "unit", type: "string" },
          { name: "harvestDate", type: "string" },
          { name: "farmer", type: "address" },
          { name: "createdAt", type: "uint256" },
          { name: "exists", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHarvestsByFarmer",
    inputs: [{ name: "farmer", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalHarvestCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllHarvests",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "cropName", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "unit", type: "string" },
          { name: "harvestDate", type: "string" },
          { name: "farmer", type: "address" },
          { name: "createdAt", type: "uint256" },
          { name: "exists", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFarmerHarvests",
    inputs: [{ name: "farmer", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "id", type: "uint256" },
          { name: "cropName", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "unit", type: "string" },
          { name: "harvestDate", type: "string" },
          { name: "farmer", type: "address" },
          { name: "createdAt", type: "uint256" },
          { name: "exists", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "HarvestAdded",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "farmer", type: "address", indexed: true },
      { name: "cropName", type: "string", indexed: false },
      { name: "quantity", type: "uint256", indexed: false },
      { name: "unit", type: "string", indexed: false },
      { name: "harvestDate", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "HarvestUpdated",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "farmer", type: "address", indexed: true },
      { name: "cropName", type: "string", indexed: false },
      { name: "quantity", type: "uint256", indexed: false },
      { name: "unit", type: "string", indexed: false },
      { name: "harvestDate", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "HarvestDeleted",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "farmer", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const satisfies Abi;

