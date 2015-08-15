DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS comments;

CREATE TABLE threads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR,
  user_name_thread VARCHAR
  likes INTEGER
);


CREATE TABLE comments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 entry VARCHAR,
 user_name_comment VARCHAR,
 thread_id INTEGER,
 FOREIGN KEY (thread_id) REFERENCES threads (id)
);