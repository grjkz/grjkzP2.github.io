DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;

CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	alias TEXT UNIQUE COLLATE NOCASE,
	pass TEXT,
	avatar TEXT,
	user_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE genres ( 
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	folder_name TEXT,
	description TEXT,
	updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE threads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	genre_id INTEGER,
	creator_id INTEGER,
	topic TEXT NOT NULL,
	detail TEXT,
	votes INTEGER DEFAULT 0,
	posts INTEGER DEFAULT 0,
	location TEXT,  
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(genre_id) REFERENCES genres(id),
	FOREIGN KEY(creator_id) REFERENCES users(id)
	);

CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	thread_id INTEGER,
	user_id INTEGER,
	comment TEXT NOT NULL,
	location TEXT,
	posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(thread_id) REFERENCES threads(id),
	FOREIGN KEY(user_id) REFERENCES users(id)
	);

CREATE TRIGGER update_timestamp_threads UPDATE OF detail, topic ON threads
	BEGIN
		UPDATE threads SET updated = CURRENT_TIMESTAMP WHERE id=old.id;
		UPDATE genres SET updated = CURRENT_TIMESTAMP WHERE id=old.genre_id;
	END;

CREATE TRIGGER update_timestamp_posts UPDATE OF comment ON posts
	BEGIN
		UPDATE posts SET edited = CURRENT_TIMESTAMP WHERE id=old.id;
		UPDATE threads SET updated = CURRENT_TIMESTAMP WHERE id=old.thread_id;
-- don't know how to get the UPDATE genres to work since it has to travel 2 tiers up
		UPDATE genres SET updated = CURRENT_TIMESTAMP WHERE id=old.id;
	END;

CREATE TRIGGER update_on_new_posts AFTER INSERT ON posts
	BEGIN 
		UPDATE threads SET updated = CURRENT_TIMESTAMP WHERE id=new.thread_id;
		UPDATE threads SET posts = posts+1 WHERE id = new.thread_id;
-- don't know how to get the UPDATE genres to work since it has to travel 2 tiers up
		UPDATE genres SET updated = CURRENT_TIMESTAMP WHERE id=new.id;
	END;

CREATE TRIGGER update_on_new_threads AFTER INSERT ON threads
	BEGIN
		UPDATE genres SET updated = CURRENT_TIMESTAMP WHERE id=new.genre_id;
	END;