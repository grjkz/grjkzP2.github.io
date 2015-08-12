##### Project 2 - Forum

## User Stories
This app will take a user input and post it into a db for others to read. A forum.
The input fields will be: Alias, Body/Content
Extra fields will be timestamps

## Front-end Wireframes
Foundation will be used since I'm familiar with it.

## Pseudocode
Start with the basic skeleton for the forum.
Display all the available threads on a page by iterating through the db.
When user clicks on a thread, take the id of that thread and populate the page with all posts of that thread_id.
Users can create threads by clicking a button. INSERT INTO a threads table.
Users can create posts within the thread page.
	Entering an Alias is optional. Will default to Anon.
	Body text, Alias, and timestamp will be saved to the db. Edit-timestamp will also be used if I create an edit button.
	Once posted, page will refresh.

Displaying the posts should be in order of ID so there shouldn't be much problem in ordering the posts.

## Routes
/		landing page to welcome users and a link to /threads
/threads	displays all the folders/threads
/threads/new	form to create a new thread
/threads/:id	renders all posts with associated thread ID
/threads/:id/new	form to create a new post in thread:id


## Database Design
The database will be the biggest problem.
