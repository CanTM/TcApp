package services;

import org.bson.Document;

import domains.User;
import util.DbCommunication;

public class LoginService {

	private final String USERS_COLLECTION = "users";

	public void createNewUser(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName()).append("password", user.getPassword());
		db.addToCollection(USERS_COLLECTION, doc);
	}

	public boolean findUser(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName()).append("password", user.getPassword());
		return db.findOne(USERS_COLLECTION, doc);
	}
}
