CREATE TABLE `Exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`question` text NOT NULL,
	`solution` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Note` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL
);
