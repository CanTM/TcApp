package services;

import org.bson.Document;

import domains.User;
import util.DbCommunication;

public class LoginService {

	private final String USERS_COLLECTION = "user";

	public String createNewUser(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName()).append("password", user.getPassword());
		db.addToCollection(USERS_COLLECTION, doc);
		db.closeDb();
		return findUser(user);
	}

	public String findUser(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName()).append("password", user.getPassword());
		String docFound = db.findOne(USERS_COLLECTION, doc).first().toJson();
		db.closeDb();
		return docFound;
	}
}
