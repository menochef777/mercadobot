-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "produtos" TEXT,
    "diaVisita" TEXT,
    "ultimaEntregaData" DATETIME,
    "ultimaEntregaValor" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
