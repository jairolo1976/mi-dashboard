/*
  Warnings:

  - You are about to drop the column `nombre` on the `Casillero` table. All the data in the column will be lost.
  - You are about to drop the column `puesto` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the `Alerta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Casillero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Mensaje` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cargo` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "alergias" TEXT,
ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "apellidoTutor" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "emailTutor" TEXT,
ADD COLUMN     "enfermedades" TEXT,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "foto" TEXT,
ADD COLUMN     "grupoSanguineo" TEXT,
ADD COLUMN     "medicamentos" TEXT,
ADD COLUMN     "nombreTutor" TEXT,
ADD COLUMN     "numeroSeguro" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "relacionTutor" TEXT,
ADD COLUMN     "seguroMedico" TEXT,
ADD COLUMN     "telefonoTutor" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Casillero" DROP COLUMN "nombre",
ADD COLUMN     "alumnoId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "numero" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Mensaje" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "puesto",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Alerta";

-- DropTable
DROP TABLE "Documento";

-- DropTable
DROP TABLE "Equipo";

-- DropTable
DROP TABLE "Notificacion";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");
