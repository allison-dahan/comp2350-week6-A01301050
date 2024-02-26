const database = include("/databaseConnection");

async function getAllUsers() {
  let sqlQuery = `
		SELECT web_user_id, first_name, last_name, email
		FROM WEB_USER;
	`;

  try {
    const results = await database.query(sqlQuery);
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error selecting from todo table");
    console.log(err);
    return null;
  }
}

const passwordPepper = "SeCretPeppa4MySal+";
async function addUser(postData) {
  let sqlInsertSalt = `
	  INSERT INTO WEB_USER (first_name, last_name, email, password_salt)   
	  VALUES (?, ?, ?, sha2(UUID(), 512));
	`;
  let params = [postData.first_name, postData.last_name, postData.email];
  console.log(sqlInsertSalt);
  try {
    const results = await database.query(sqlInsertSalt, params);
    let insertedID = results[0].insertId; // Adjust based on how your query function returns results
    let updatePasswordHash = `
		UPDATE WEB_USER    
		SET password_hash = sha2(concat(?, ?, password_salt), 512)     
		WHERE web_user_id = ?;
	  `;
    let params2 = [postData.password, passwordPepper, insertedID];
    console.log(updatePasswordHash);
    const results2 = await database.query(updatePasswordHash, params2);
    return true;
  } catch (err) {
    console.log("Error writing to MySQL");
    console.log(err);
    return false;
  }
}

async function deleteUser(webUserId) {
  let sqlDeleteUser = `   DELETE FROM WEB_USER  WHERE web_user_id = :userID  `;
  let params = { userID: webUserId };
  console.log(sqlDeleteUser);
  try {
    await database.query(sqlDeleteUser, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = { getAllUsers, addUser, deleteUser };
