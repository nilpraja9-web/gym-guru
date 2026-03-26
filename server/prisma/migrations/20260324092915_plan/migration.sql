/*
  Warnings:

  - The primary key for the `user_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "training_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_json" JSONB NOT NULL,
    "plan_text" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_training_plans_user_id" ON "training_plan"("user_id");
