-- AlterTable
ALTER TABLE "Order" ADD COLUMN "couponCode" TEXT,
ADD COLUMN "discountAmount" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Order_couponCode_idx" ON "Order"("couponCode");
