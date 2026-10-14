ALTER TABLE "Order" ADD COLUMN "provider" TEXT;
ALTER TABLE "Order" ADD COLUMN "ozowRequestId" TEXT;
ALTER TABLE "Order" ADD COLUMN "ozowTransactionId" TEXT;

CREATE UNIQUE INDEX "Order_ozowRequestId_key" ON "Order"("ozowRequestId");
