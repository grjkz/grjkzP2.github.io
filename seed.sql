INSERT INTO users (alias) VALUES ("admin");

INSERT INTO genres (folder_name,description) VALUES 
	("Action","physical challenges, including hand–eye coordination and reaction-time"),
	("Adventure","interactive story driven by exploration and puzzle-solving"),
	("FPS","gun and projectile weapon-based combat through a first-person perspective"),
	("RPG","control the actions of a main character (or several adventuring party members) immersed in some well-defined world"),
	("Simulation","closely simulate aspects of a real or fictional reality"),
	("Strategy","decision-making skills have a high significance in determining the outcome"),
	("Sports" "simulates the practice of traditional sports"),
	("Tabletop","games that are normally played on a table or other flat surface"),
	("Other","unrelated chatter or a genre not listed above");

INSERT INTO threads (genre_id,creator_id,topic,detail) VALUES (1,1,"Best Devil May Cry Game?","Which of all the games do you think trumps all of the others and why?\n Personally, I like DMC3 because the mechanics are good and it was the last of its series to use the original Dante.");

INSERT INTO posts (thread_id,user_id,comment) VALUES (1,1,"I loved DMC2 because emo.");