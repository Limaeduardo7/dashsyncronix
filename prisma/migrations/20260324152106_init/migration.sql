-- CreateTable
CREATE TABLE "MetricsDaily" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "faturamentoHotmart" REAL NOT NULL,
    "faturamentoYoutube" REAL NOT NULL,
    "investimentoMeta" REAL NOT NULL,
    "investimentoGoogle" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "custoFixoMensal" REAL NOT NULL,
    "impostoMetaPercent" REAL NOT NULL,
    "impostoFaturamentoPercent" REAL NOT NULL,
    "percentualReserva" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "percentual" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MetricsDaily_date_key" ON "MetricsDaily"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_nome_key" ON "Partner"("nome");
