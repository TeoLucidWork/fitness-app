-- CreateTable
CREATE TABLE "workout_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "programSessionId" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "notes" TEXT,
    "rating" INTEGER,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workout_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "workout_logs_programSessionId_fkey" FOREIGN KEY ("programSessionId") REFERENCES "program_sessions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercise_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workoutLogId" INTEGER NOT NULL,
    "programExerciseId" INTEGER NOT NULL,
    "actualSets" INTEGER NOT NULL,
    "actualReps" TEXT NOT NULL,
    "actualWeight" TEXT,
    "actualRestPeriod" INTEGER,
    "actualRpe" INTEGER,
    "notes" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercise_logs_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "workout_logs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exercise_logs_programExerciseId_fkey" FOREIGN KEY ("programExerciseId") REFERENCES "program_exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
