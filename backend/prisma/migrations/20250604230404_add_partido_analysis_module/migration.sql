-- CreateTable
CREATE TABLE "partidos" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "rival" TEXT NOT NULL,
    "esLocal" BOOLEAN NOT NULL DEFAULT true,
    "golesPropio" INTEGER NOT NULL DEFAULT 0,
    "golesRival" INTEGER NOT NULL DEFAULT 0,
    "competicion" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "clima" TEXT,
    "temperatura" INTEGER,
    "estadio" TEXT,
    "arbitro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alineaciones_partido" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "posicion" TEXT NOT NULL,
    "esTitular" BOOLEAN NOT NULL DEFAULT true,
    "minutosJugados" INTEGER NOT NULL DEFAULT 0,
    "esCapitan" BOOLEAN NOT NULL DEFAULT false,
    "dorsalPartido" INTEGER,
    "minutoSalida" INTEGER,
    "minutoEntrada" INTEGER,
    "cambiadoPor" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alineaciones_partido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estadisticas_equipo" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "esEquipoPropio" BOOLEAN NOT NULL DEFAULT true,
    "posesionPorcentaje" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "tirosTotal" INTEGER NOT NULL DEFAULT 0,
    "tirosPuerta" INTEGER NOT NULL DEFAULT 0,
    "tirosDesviados" INTEGER NOT NULL DEFAULT 0,
    "tirosBloqueados" INTEGER NOT NULL DEFAULT 0,
    "pasesCompletados" INTEGER NOT NULL DEFAULT 0,
    "pasesIntentados" INTEGER NOT NULL DEFAULT 0,
    "precisionPase" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recuperaciones" INTEGER NOT NULL DEFAULT 0,
    "intercepciones" INTEGER NOT NULL DEFAULT 0,
    "entradas" INTEGER NOT NULL DEFAULT 0,
    "entradasExitosas" INTEGER NOT NULL DEFAULT 0,
    "corners" INTEGER NOT NULL DEFAULT 0,
    "tirosLibres" INTEGER NOT NULL DEFAULT 0,
    "penales" INTEGER NOT NULL DEFAULT 0,
    "faltasCommetidas" INTEGER NOT NULL DEFAULT 0,
    "faltasRecibidas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasAmarillas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasRojas" INTEGER NOT NULL DEFAULT 0,
    "offsides" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estadisticas_equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estadisticas_individuales" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "posicionJugada" TEXT NOT NULL,
    "minutosJugados" INTEGER NOT NULL DEFAULT 0,
    "goles" INTEGER NOT NULL DEFAULT 0,
    "asistencias" INTEGER NOT NULL DEFAULT 0,
    "tiros" INTEGER NOT NULL DEFAULT 0,
    "tirosPuerta" INTEGER NOT NULL DEFAULT 0,
    "ocasionesCreadas" INTEGER NOT NULL DEFAULT 0,
    "pasesCompletados" INTEGER NOT NULL DEFAULT 0,
    "pasesIntentados" INTEGER NOT NULL DEFAULT 0,
    "pasesClave" INTEGER NOT NULL DEFAULT 0,
    "centros" INTEGER NOT NULL DEFAULT 0,
    "centrosExitosos" INTEGER NOT NULL DEFAULT 0,
    "recuperaciones" INTEGER NOT NULL DEFAULT 0,
    "intercepciones" INTEGER NOT NULL DEFAULT 0,
    "entradas" INTEGER NOT NULL DEFAULT 0,
    "entradasExitosas" INTEGER NOT NULL DEFAULT 0,
    "despejes" INTEGER NOT NULL DEFAULT 0,
    "bloqueos" INTEGER NOT NULL DEFAULT 0,
    "duelosGanados" INTEGER NOT NULL DEFAULT 0,
    "duelosPerdidos" INTEGER NOT NULL DEFAULT 0,
    "duelosAereos" INTEGER NOT NULL DEFAULT 0,
    "duelosAereosGanados" INTEGER NOT NULL DEFAULT 0,
    "regates" INTEGER NOT NULL DEFAULT 0,
    "regatesExitosos" INTEGER NOT NULL DEFAULT 0,
    "carrerasProgresivas" INTEGER NOT NULL DEFAULT 0,
    "distanciaRecorrida" DOUBLE PRECISION,
    "paradasRealizadas" INTEGER NOT NULL DEFAULT 0,
    "golesEncajados" INTEGER NOT NULL DEFAULT 0,
    "salidasExitosas" INTEGER NOT NULL DEFAULT 0,
    "centrosAtrapados" INTEGER NOT NULL DEFAULT 0,
    "faltasCommetidas" INTEGER NOT NULL DEFAULT 0,
    "faltasRecibidas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasAmarillas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasRojas" INTEGER NOT NULL DEFAULT 0,
    "offsides" INTEGER NOT NULL DEFAULT 0,
    "calificacion" DOUBLE PRECISION,
    "notaPartido" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estadisticas_individuales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_partido" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "minuto" INTEGER NOT NULL,
    "segundos" INTEGER NOT NULL DEFAULT 0,
    "tipoEvento" TEXT NOT NULL,
    "jugadorPrincipal" INTEGER,
    "jugadorSecundario" INTEGER,
    "esEquipoPropio" BOOLEAN NOT NULL DEFAULT true,
    "coordenadaX" DOUBLE PRECISION,
    "coordenadaY" DOUBLE PRECISION,
    "descripcion" TEXT NOT NULL,
    "esEventoClave" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_partido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes_partido" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "resumenGeneral" TEXT,
    "puntosPositivos" TEXT,
    "puntosNegativos" TEXT,
    "analisisOfensivo" TEXT,
    "analisisDefensivo" TEXT,
    "mejorJugador" INTEGER,
    "peorRendimiento" INTEGER,
    "objetivosTacticos" TEXT,
    "areasDeEnfoque" TEXT,
    "estaCompleto" BOOLEAN NOT NULL DEFAULT false,
    "enviadoAPadres" BOOLEAN NOT NULL DEFAULT false,
    "fechaEnvio" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportes_partido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reportes_partido_partidoId_key" ON "reportes_partido"("partidoId");

-- AddForeignKey
ALTER TABLE "alineaciones_partido" ADD CONSTRAINT "alineaciones_partido_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alineaciones_partido" ADD CONSTRAINT "alineaciones_partido_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadisticas_equipo" ADD CONSTRAINT "estadisticas_equipo_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadisticas_individuales" ADD CONSTRAINT "estadisticas_individuales_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estadisticas_individuales" ADD CONSTRAINT "estadisticas_individuales_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_partido" ADD CONSTRAINT "eventos_partido_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_partido" ADD CONSTRAINT "reportes_partido_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
