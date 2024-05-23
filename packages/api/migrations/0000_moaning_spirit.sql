CREATE TABLE `Exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`concise_answer` text NOT NULL,
	`source_id` integer
);
--> statement-breakpoint
CREATE TABLE `Note` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Source` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`author` text,
	`date` text,
	`publisher` text,
	`url` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
