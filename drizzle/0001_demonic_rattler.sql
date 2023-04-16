CREATE TABLE `accounts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`user_id` int,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`type` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expiresAt` int,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text
);

CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`session_token` text NOT NULL,
	`user_id` int NOT NULL,
	`expires` timestamp NOT NULL
);

ALTER TABLE `users` RENAME COLUMN `username` TO `email`;
ALTER TABLE `users` RENAME COLUMN `password` TO `email_verified`;
ALTER TABLE `users` MODIFY COLUMN `email` varchar(40) NOT NULL;
ALTER TABLE `users` MODIFY COLUMN `email_verified` timestamp;
ALTER TABLE `users` ADD `name` varchar(40);
ALTER TABLE `users` ADD `image` text;
ALTER TABLE `users` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;
ALTER TABLE `users` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
CREATE UNIQUE INDEX `user_id_unique` ON `users` (`id`);