-- CreateTable
CREATE TABLE "MappedColumnJSON" (
    "id" TEXT NOT NULL,
    "projectID" TEXT NOT NULL,
    "jsonMapping" TEXT[],

    CONSTRAINT "MappedColumnJSON_pkey" PRIMARY KEY ("id")
);
