DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;

CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	alias TEXT,
	user_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE genres ( 
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	folder_name TEXT
	);

CREATE TABLE threads (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	genre_id INTEGER,
	creator_id INTEGER,
	topic TEXT NOT NULL,
	detail TEXT,
	votes INTEGER DEFAULT 0,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(genre_id) REFERENCES genres(id),
	FOREIGN KEY(creator_id) REFERENCES users(id)
	);

CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	thread_id INTEGER,
	user_id INTEGER,
	comment TEXT,
	posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(thread_id) REFERENCES threads(id),
	FOREIGN KEY(user_id) REFERENCES users(id)
	);

CREATE TRIGGER update_timestamp_threads UPDATE OF detail, topic ON threads
	BEGIN
		UPDATE threads SET updated = CURRENT_TIMESTAMP WHERE id=old.id;
	END;

CREATE TRIGGER update_timestamp_posts UPDATE OF comment ON posts
	BEGIN
		UPDATE posts SET edited = CURRENT_TIMESTAMP WHERE id=old.id;
		UPDATE threads SET updated = CURRENT_TIMESTAMP WHERE id=old.id;
	END;