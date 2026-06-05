CREATE TABLE `community_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` enum('question','walk','review','free') NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`viewCount` int DEFAULT 0,
	`likeCount` int DEFAULT 0,
	`commentCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`placeId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('dog','cat','other') NOT NULL,
	`breed` varchar(100),
	`ageYears` int,
	`weightKg` decimal(5,2),
	`gender` enum('male','female','unknown') DEFAULT 'unknown',
	`personality` text,
	`notes` text,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` enum('cafe','restaurant','hospital','grooming','kindergarten','hotel','park','petshop') NOT NULL,
	`address` text NOT NULL,
	`addressDetail` text,
	`lat` float NOT NULL,
	`lng` float NOT NULL,
	`phone` varchar(20),
	`website` text,
	`description` text,
	`openingHours` text,
	`priceInfo` text,
	`imageUrl` text,
	`allowSmallDog` boolean DEFAULT false,
	`allowMediumDog` boolean DEFAULT false,
	`allowLargeDog` boolean DEFAULT false,
	`allowCat` boolean DEFAULT false,
	`hasParking` boolean DEFAULT false,
	`hasReservation` boolean DEFAULT false,
	`avgRating` decimal(3,2) DEFAULT '0.00',
	`reviewCount` int DEFAULT 0,
	`favoriteCount` int DEFAULT 0,
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `places_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`placeId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`content` text,
	`imageUrl` text,
	`petType` enum('dog','cat','other'),
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `loginMethod` varchar(32);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `lastSignedIn` timestamp DEFAULT (now());