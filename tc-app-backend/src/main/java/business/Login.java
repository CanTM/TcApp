package business;

import org.bson.Document;

import database.DbCommunication;

public class Login {

	private final String USERS_COLLECTION = "users";

	public void createNewUser(String username, String password) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", username).append("password", password);
		db.addToCollection(USERS_COLLECTION, doc);
	}

	public boolean findUser(String username, String password) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", username).append("password", password);
		return db.findOne(USERS_COLLECTION, doc);
	}
}
