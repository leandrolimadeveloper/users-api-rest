CREATE TABLE `apiusers`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `role` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

CREATE TABLE `apiusers`.`password_tokens` (
  `id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(250) NULL,
  `user_id` INT UNSIGNED NULL,
  PRIMARY KEY (`id`));

/* Chave Estrangeira */
ALTER TABLE `apiusers`.`password_tokens` 
ADD INDEX `fk_1_idx` (`user_id` ASC) VISIBLE;
;
ALTER TABLE `apiusers`.`password_tokens` 
ADD CONSTRAINT `fk_1`
  FOREIGN KEY (`user_id`)
  REFERENCES `apiusers`.`users` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE `apiusers`.`password_tokens` 
ADD COLUMN `used` TINYINT(10) UNSIGNED NULL AFTER `user_id`;
