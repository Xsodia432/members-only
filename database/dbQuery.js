const pool = require("./dbCon");

exports.getUser = async (username, id) => {
  const { rows } = await pool.query(
    "SELECT users.id,password,first_name,last_name,username,tier from users JOIN membership ON membership.id = users.membership_status WHERE username=$1 OR users.id=$2",
    [username, id]
  );

  return rows[0];
};
exports.insertUser = async (
  firstname,
  lastname,
  username,
  password,
  membership
) => {
  await pool.query(
    "INSERT INTO users(first_name,last_name,password,membership_status,username) VALUES($1,$2,$3,$4,$5)",
    [firstname, lastname, password, membership, username]
  );
};
exports.updateMembership = async (id, tier) => {
  await pool.query("UPDATE users SET membership_status = $1 WHERE id=$2", [
    tier,
    id,
  ]);
};
exports.createPost = async (title, postContent, timeStamp, id) => {
  await pool.query(
    "INSERT INTO posts(title,post,timestamp,user_id) VALUES($1,$2,$3,$4)",
    [title, postContent, timeStamp, id]
  );
};
exports.getPosts = async (tier) => {
  let rows = [];
  if (tier) {
    rows = await pool.query(
      "SELECT posts.id,title,post,timestamp,first_name,last_name,username,users.id as uID FROM posts JOIN users ON users.id = posts.user_id JOIN membership ON users.membership_status = membership.id "
    );
  }

  return rows;
};
exports.findUserByUserName = async (username) => {
  const { rows } = await pool.query("SELECT * from users WHERE username=$1", [
    username,
  ]);
  return rows;
};
exports.findPostById = async (id) => {
  const { rows } = await pool.query("SELECT * from posts WHERE id=$1", [id]);
  return rows;
};
