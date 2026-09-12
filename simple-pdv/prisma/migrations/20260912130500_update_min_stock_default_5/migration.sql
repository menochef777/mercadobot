-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "productId" TEXT NOT NULL PRIMARY KEY,
    "barcode" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "costPrice" REAL NOT NULL,
    "discount" REAL,
    "stockQuantity" INTEGER NOT NULL,
    "quantidadeAtual" INTEGER NOT NULL DEFAULT 0,
    "quantidadeMinima" INTEGER NOT NULL DEFAULT 5,
    "weight" REAL,
    "categoryCategoryId" TEXT,
    "imgURL" TEXT NOT NULL DEFAULT '/files/1720098149585_por-do-sol-e-silhuetas-de-arvores-nas-montanhas-generative-ai.jpg',
    CONSTRAINT "Product_categoryCategoryId_fkey" FOREIGN KEY ("categoryCategoryId") REFERENCES "Category" ("categoryId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("barcode", "categoryCategoryId", "costPrice", "description", "discount", "imgURL", "name", "price", "productId", "quantidadeAtual", "quantidadeMinima", "sku", "stockQuantity", "weight") SELECT "barcode", "categoryCategoryId", "costPrice", "description", "discount", "imgURL", "name", "price", "productId", "quantidadeAtual", "quantidadeMinima", "sku", "stockQuantity", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
