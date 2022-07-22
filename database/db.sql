CREATE TABLE "channel" (
  "channel_id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL
);

CREATE TABLE "video" (
  "video_id" TEXT PRIMARY KEY NOT NULL,
  "title" TEXT NOT NULL,
  "channel_id" INTEGER NOT NULL,
  "duration" INTEGER,
  "created_timestamp" INTEGER,
  "view_count" INTEGER
);

CREATE TABLE "history" (
  "timestamp" INTEGER NOT NULL PRIMARY KEY,
  "video_id" TEXT NOT NULL
);
