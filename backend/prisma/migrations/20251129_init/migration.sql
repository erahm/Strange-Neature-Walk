-- Migration: init

-- Create Role enum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'MANAGER', 'ADMIN');

-- Create User table
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'VIEWER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add unique index on email
CREATE UNIQUE INDEX "User_email_unique" ON "User" ("email");
