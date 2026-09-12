-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Item" (
    "quantity" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL PRIMARY KEY,
    "productProductId" TEXT,
    "orderOrderId" TEXT,
    CONSTRAINT "Item_productProductId_fkey" FOREIGN KEY ("productProductId") REFERENCES "Product" ("productId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_orderOrderId_fkey" FOREIGN KEY ("orderOrderId") REFERENCES "Order" ("orderId") ON DELETE SET NULL ON UPDATE CASCADE
);
