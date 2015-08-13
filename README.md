# Project 2 - Forum

### User Stories
This app will take a user input and post it into a db for others to read. A forum.

The input fields will be: Alias, Body/Content
Extra fields in db will be timestamps.

### Front-end Wireframes
Foundation will be used since I'm familiar with it.

### Pseudocode
Start with the basic skeleton for the forum.
Display all the available threads on a page by iterating through the db.
When user clicks on a thread, take the id of that thread and populate the page with all posts of that thread_id.
Users can create threads by clicking a button. INSERT INTO a threads table.
Users can create posts within the thread page.
	Entering an Alias is optional. Will default to Anon.
	Body text, Alias, and timestamp will be saved to the db. Edit-timestamp will also be used if I create an edit button.
	Once posted, page will refresh.

Displaying the posts should be in order of ID so there shouldn't be much problem in ordering the posts.

### Routes
Route | Method | EJS | dbTable Used | Purpose
------|--------|-----|--------------|---------
/	| GET | index.ejs | posts, threads | landing page to welcome users 
/board | GET | showTop.ejs | threads, posts | displays all the folders/threads
/board/:genre | GET | showThreads.ejs | posts, threads(for topic name) | renders all threads with associated genre
/board/:genre/new | GET | newThread.ejs | none	| form to create a new thread
/board/:genre | POST | board.ejs | threads, posts | create new thread + redirects
/board/:genre/:thread_id | GET | showPosts.ejs | posts, threads | renders all posts in associated thread
/board/:genre/:thread_id/post | GET | newPost.ejs | none | gen. form to create a new post in thread:id
/board/:genre/:thread_id | POST | posts.ejs | posts, threads | save new thread + redirect
/board/:genre/:thread_id | DELETE | none | posts, threads | delete thread and associated posts
/board/:genre/:thread_id/:post_id/edit | GET | editPost.ejs | posts | form for editing post
/board/:genre/:thread_id | PUT | posts.ejs | posts, threads | overwrite db with new post + redirect
/board/:genre/:thread_id/:post_id | DELETE | none | posts,threads | delete post + refresh
/board/:genre/:thread_id | POST | posts.ejs | posts, threads | liking OP + refresh page
/polls | GET | showPolls.ejs | polls | render list of polls
/polls/new | GET | newPoll.ejs | none | form to create a new poll
/polls/:poll_id | GET | pollDetails.ejs | polls, polloptions | render a poll's question and its options
polls/:poll_id/edit | GET | editPoll.ejs | polloptions | render edit page for poll_id
/polls/:poll_id | PUT | pollDetails.ejs | polls, polloptions | edit poll_id db and redirect
/polls/:poll_id | DELETE | none | polls, polloptions | delete poll and its options + redirect

### Database Design
The database will be the biggest problem.
