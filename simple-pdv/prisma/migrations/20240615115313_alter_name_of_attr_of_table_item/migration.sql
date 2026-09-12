/*
  Warnings:

  - You are about to drop the column `orderOrderId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `productProductId` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "quantity" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "orderId" TEXT,
    CONSTRAINT "Item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("productId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("itemId", "quantity") SELECT "itemId", "quantity" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
