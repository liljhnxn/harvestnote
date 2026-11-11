# 🌾 HarvestNote

> **Tagline:** Every Harvest Has a Story.

**HarvestNote** is a minimalist, responsive, and fully decentralized farming journal built for the **Botchain Testnet** (Chain ID: `968`). It empowers farmers and agricultural producers to record their harvests, track cumulative yields, maintain verifiable crop histories, and explore historical farming records directly on-chain without any centralized database, backend, tokens, or NFTs.

---

## 🌟 Key Features

- **Exact Single-Contract Architecture:** Powered strictly by one Solidity smart contract (`HarvestNote.sol`) deployed to Botchain Testnet.
- **Permanent On-Chain Records:** Every harvest entry is immutably stored on the blockchain with a unique ID, crop name, quantity, unit, date, farmer address, and block timestamp.
- **Farmer Data Ownership:** Original farmers retain exclusive control to update or delete their harvest records via cryptographically verified transactions.
- **Live On-Chain Statistics:**
  - Total Harvests
  - Total Quantity Harvested
  - Unique Crop Varieties Recorded
  *(All statistics are calculated dynamically from actual smart contract data belonging to the connected wallet).*
- **Public & Permissionless Browsing:** Anyone can inspect all public harvest journals and farmer records without connecting a wallet.
- **MetaMask & Botchain Testnet Integration:**
  - Seamless MetaMask connection and disconnection.
  - Automatic chain detection with wrong-network warning.
  - One-click network switching to Botchain Testnet (Chain ID `968`).
  - Real transaction signing and on-chain confirmation receipts linking directly to BohrScan.
- **Agricultural Journal Aesthetic:** Designed with earthy tones (`#F3F0E6`, `#354B32`, `#D69B52`, `#829477`), clean typography, crop-specific iconography, and a tactile vertical journal timeline.
- **Single Page Application:** Exactly ONE responsive webpage (`app/page.tsx`) with zero extra routes.

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3 Libraries:** Wagmi v2, Viem v2, TanStack React Query v5
- **Icons:** Lucide React
- **Wallet Support:** MetaMask / Injected Web3 Provider

### Smart Contract & Blockchain
- **Language:** Solidity `^0.8.20`
- **Development Toolchain:** Hardhat
- **Testing:** Mocha, Chai, Hardhat Ethers
- **Network:** Botchain Testnet (Chain ID `968`, RPC: `https://rpc.bohr.life`, Explorer: `https://scan.bohr.life`)

---

## 🌐 Botchain Testnet Configuration

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **Currency Symbol** | `BOHR` |
| **Decimals** | 18 |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |

---

## 📂 Project Structure

```text
HarvestNote/
├── app/
│   ├── globals.css         # Custom earthy styling & Tailwind directives
│   ├── layout.tsx          # Root layout & Wagmi/React Query providers
│   ├── page.tsx            # The single unified HarvestNote journal page
│   └── providers.tsx       # Client-side Wagmi & QueryClient provider
├── components/
│   ├── Navbar.tsx          # Header with branding, navigation & MetaMask controls
│   ├── Hero.tsx            # Editorial hero with tagline & agricultural art
│   ├── HarvestStats.tsx    # Live on-chain statistics (Count, Quantity, Crops)
│   ├── AddHarvest.tsx      # Add harvest form with on-chain transaction lifecycle
│   ├── HarvestHistory.tsx  # Vertical timeline, search & All/My filters
│   ├── HarvestItem.tsx     # Journal card with inline editing & deletion
│   └── Footer.tsx          # Project details, network status & BohrScan links
├── contracts/
│   └── HarvestNote.sol     # The single Solidity smart contract
├── scripts/
│   └── deploy.ts           # Hardhat deployment script for Botchain Testnet
├── test/
│   └── HarvestNote.test.ts # Comprehensive test suite for all contract methods
├── lib/
│   ├── contract.ts         # Contract ABI and address configuration
│   └── wagmi.ts            # Botchain custom chain definition & Wagmi setup
├── hardhat.config.ts       # Hardhat configuration with Botchain network
├── tailwind.config.ts      # Custom colour palette and typography extensions
├── .env.example            # Environment variables template
└── README.md               # Complete project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x, v20.x, or v22.x recommended)
- [MetaMask](https://metamask.io/) browser extension

### 2. Installation
Clone the repository and install all dependencies:

```bash
git clone <repository-url>
cd HarvestNote
npm install
```

### 3. Environment Setup
Copy the environment variables template:

```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Botchain Testnet RPC URL
BOTCHAIN_RPC_URL=https://rpc.bohr.life

# Deployer Private Key (For contract deployment)
PRIVATE_KEY=your_private_key_here

# Deployed HarvestNote Contract Address on Botchain Testnet (Chain ID 968)
NEXT_PUBLIC_HARVESTNOTE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

---

## 🧪 Smart Contract Compilation & Testing

Compile the Solidity smart contract:
```bash
npm run compile
```

Run the complete test suite:
```bash
npm run test
```

The test suite validates:
- [x] Successful harvest creation and `HarvestAdded` event emission.
- [x] Rejection of empty crop names.
- [x] Rejection of zero or negative quantities.
- [x] Rejection of empty measurement units.
- [x] Rejection of empty harvest dates.
- [x] Accurate harvest count and ID retrieval.
- [x] Wallet-specific harvest retrieval.
- [x] Authorized updates by record owners with `HarvestUpdated` event emission.
- [x] Rejection of unauthorized update attempts.
- [x] Authorized deletions by record owners with `HarvestDeleted` event emission.
- [x] Rejection of unauthorized deletion attempts.
- [x] Safe rejection of non-existent or previously deleted harvest IDs.

---

## 📦 Deploying to Botchain Testnet

1. Ensure your deployer wallet holds testnet **BOHR** for gas fees.
2. In `.env.local` (or `.env`), set `PRIVATE_KEY` to your deployer wallet's private key.
3. Run the deployment script:
   ```bash
   npm run deploy:botchain
   ```
4. Copy the logged contract address and update:
   - `NEXT_PUBLIC_HARVESTNOTE_CONTRACT_ADDRESS` in `.env.local`
   - Or `HARVESTNOTE_CONTRACT_ADDRESS` in `lib/contract.ts`

---

## 💻 Running the Frontend

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:
```bash
npm run build
npm run start
```

---

## 🦊 Connecting MetaMask to Botchain Testnet

1. Click **"Connect Wallet"** in the top navigation bar.
2. If your MetaMask is on another network, click **"Switch to Botchain"**.
3. MetaMask will prompt you to add or switch to **Botchain Testnet** (Chain ID: `968`, RPC: `https://rpc.bohr.life`).
4. Approve the prompt, and you're ready to start recording your harvests!

---

## 📜 License
MIT License. Built for farmers everywhere.

