# Lending Protocol

## Overview

This project implements a decentralized lending protocol where lenders and borrowers interact seamlessly. The system enables lenders to deposit AVAX into a liquidity pool and earn daily interest, while borrowers can take AVAX loans by providing collateral in ERC-20 tokens.

## Features

### Lender

- Can deposit AVAX into the liquidity pool.
- Earns **0.2% daily interest** on the deposited amount.
- Can withdraw the deposited amount anytime.

### Borrower

- Can borrow AVAX by providing **collateral in any ERC-20 token**.
- Must pay an additional **0.5% fee on the borrowed AVAX** when repaying the loan.

## Scalability

- The system will be **enhanced using an orchestration API** for better transaction management and scalability.
- Uses **Prisma with PostgreSQL** for user storage and data management.

## Tech Stack

- **Frontend:** Next.js
- **Blockchain:** AVAX, ERC-20 Tokens
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma
- **Orchestration:** API layer for improved scalability

## Environment Variables

Ensure you have the following environment variables set up:

```
DATABASE_URL=your_database_url
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_LOGIN_CONTRACT_ADDRESS=your_login_contract_address
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

## Video Demonstration

[![Watch the Video](video_thumbnail.png)](video_link_here)

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   ```
2. Navigate to the project directory:
   ```sh
   cd lending-protocol
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables (refer to `.env.example`)
5. Start the server:
   ```sh
   npm run dev
   ```

## Contributing

Feel free to open issues or submit pull requests to enhance the project!

## License

This project is licensed under the MIT License.
