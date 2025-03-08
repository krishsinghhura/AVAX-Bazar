-- CreateTable
CREATE TABLE "Users" (
    "address" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_address_key" ON "Users"("address");
