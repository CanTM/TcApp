package services;

import org.bson.Document;

import domains.User;
import util.DbCommunication;

public class LoginService {

	private final String USERS_COLLECTION = "user";

	public void createNewUser(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName()).append("password", user.getPassword());
		db.addToCollection(USERS_COLLECTION, doc);
		db.closeDb();
	}

	public boolean findUser(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName()).append("password", user.getPassword());
		Document docFound = db.findOne(USERS_COLLECTION, doc).first();
		boolean found = docFound != null ? true : false;
		return found;
	}
}
