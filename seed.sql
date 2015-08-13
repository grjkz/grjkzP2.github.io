INSERT INTO users (alias) VALUES ("admin");

INSERT INTO genres (folder_name) VALUES ("Action"),("Adventure"),("FPS"),("RPG"),("Simulation"),("Strategy"),("Sports"),("Table Top"),("Other");

INSERT INTO threads (genre_id,creator_id,topic,detail) VALUES (1,1,"Best Devil May Cry Game?","Which of all the games do you think trumps all of the others and why?\n Personally, I like DMC3 because the mechanics are good and it was the last of its series to use the original Dante.");

INSERT INTO posts (thread_id,user_id,comment) VALUES (1,1,"I loved DMC2 because emo.");