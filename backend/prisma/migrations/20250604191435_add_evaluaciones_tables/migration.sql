-- DropIndex
DROP INDEX "Casillero_numero_key";

-- DropIndex
DROP INDEX "Staff_email_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "numeroCamiseta" INTEGER,
ADD COLUMN     "posicion" TEXT;

-- CreateTable
CREATE TABLE "ConfiguracionEvaluacion" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "periodicidadMeses" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PruebaFisica" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "PruebaFisica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultadoFisico" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "pruebaId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "semaforo" TEXT NOT NULL,
    "percentil" INTEGER,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultadoFisico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionTecnica" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipoEvaluacion" TEXT NOT NULL,
    "goles" INTEGER NOT NULL DEFAULT 0,
    "asistencias" INTEGER NOT NULL DEFAULT 0,
    "tirosPuerta" INTEGER NOT NULL DEFAULT 0,
    "tirosDesviados" INTEGER NOT NULL DEFAULT 0,
    "pasesBuenos" INTEGER NOT NULL DEFAULT 0,
    "pasesTotales" INTEGER NOT NULL DEFAULT 0,
    "porcentajePases" DOUBLE PRECISION,
    "recuperaciones" INTEGER NOT NULL DEFAULT 0,
    "intercepciones" INTEGER NOT NULL DEFAULT 0,
    "duelosGanados" INTEGER NOT NULL DEFAULT 0,
    "duelosPerdidos" INTEGER NOT NULL DEFAULT 0,
    "minutosJugados" INTEGER NOT NULL DEFAULT 0,
    "kmRecorridos" DOUBLE PRECISION,
    "toqueBalon" INTEGER,
    "semaforoOfensivo" TEXT,
    "semaforoDefensivo" TEXT,
    "semaforoPases" TEXT,
    "semaforoGeneral" TEXT NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluacionTecnica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionActitudinal" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "periodo" TEXT NOT NULL,
    "disciplina" INTEGER NOT NULL,
    "concentracion" INTEGER NOT NULL,
    "puntualidad" INTEGER NOT NULL,
    "trabajoEquipo" INTEGER NOT NULL,
    "liderazgo" INTEGER NOT NULL,
    "resiliencia" INTEGER NOT NULL,
    "tarjetasAmarillas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasRojas" INTEGER NOT NULL DEFAULT 0,
    "asistenciaPercent" DOUBLE PRECISION,
    "semaforoDisciplina" TEXT,
    "semaforoTrabajEquipo" TEXT,
    "semaforoMentalidad" TEXT,
    "semaforoGeneral" TEXT NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluacionActitudinal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionGlobal" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "periodo" TEXT NOT NULL,
    "semaforoFisico" TEXT NOT NULL,
    "semaforoTecnico" TEXT NOT NULL,
    "semaforoTactico" TEXT NOT NULL,
    "semaforoActitudinal" TEXT NOT NULL,
    "notaGeneral" DOUBLE PRECISION,
    "percentilCategoria" INTEGER,
    "fortalezas" TEXT[],
    "areasDesarrollo" TEXT[],
    "recomendaciones" TEXT[],
    "tendenciaFisica" TEXT,
    "tendenciaTecnica" TEXT,
    "tendenciaActitudinal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluacionGlobal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NormativaReferencia" (
    "id" SERIAL NOT NULL,
    "pruebaId" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "sexo" TEXT,
    "edadMin" INTEGER,
    "edadMax" INTEGER,
    "valorExcelente" DOUBLE PRECISION NOT NULL,
    "valorBueno" DOUBLE PRECISION NOT NULL,
    "valorPromedio" DOUBLE PRECISION NOT NULL,
    "valorBajo" DOUBLE PRECISION NOT NULL,
    "valorCritico" DOUBLE PRECISION NOT NULL,
    "menorEsMejor" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NormativaReferencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionEvaluacion_alumnoId_key" ON "ConfiguracionEvaluacion"("alumnoId");

-- CreateIndex
CREATE UNIQUE INDEX "PruebaFisica_codigo_key" ON "PruebaFisica"("codigo");

-- CreateIndex
CREATE INDEX "ResultadoFisico_alumnoId_fecha_idx" ON "ResultadoFisico"("alumnoId", "fecha");

-- CreateIndex
CREATE INDEX "EvaluacionTecnica_alumnoId_fecha_idx" ON "EvaluacionTecnica"("alumnoId", "fecha");

-- CreateIndex
CREATE INDEX "EvaluacionActitudinal_alumnoId_fecha_idx" ON "EvaluacionActitudinal"("alumnoId", "fecha");

-- CreateIndex
CREATE INDEX "EvaluacionGlobal_alumnoId_fecha_idx" ON "EvaluacionGlobal"("alumnoId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "NormativaReferencia_pruebaId_categoria_sexo_key" ON "NormativaReferencia"("pruebaId", "categoria", "sexo");

-- AddForeignKey
ALTER TABLE "ConfiguracionEvaluacion" ADD CONSTRAINT "ConfiguracionEvaluacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoFisico" ADD CONSTRAINT "ResultadoFisico_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultadoFisico" ADD CONSTRAINT "ResultadoFisico_pruebaId_fkey" FOREIGN KEY ("pruebaId") REFERENCES "PruebaFisica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionTecnica" ADD CONSTRAINT "EvaluacionTecnica_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionActitudinal" ADD CONSTRAINT "EvaluacionActitudinal_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionGlobal" ADD CONSTRAINT "EvaluacionGlobal_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NormativaReferencia" ADD CONSTRAINT "NormativaReferencia_pruebaId_fkey" FOREIGN KEY ("pruebaId") REFERENCES "PruebaFisica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
