package services;

import java.util.ArrayList;

import org.bson.Document;

import com.mongodb.client.FindIterable;

import domains.Search;
import domains.User;
import util.DbCommunication;

public class SearchService {

	private static String SEARCH_COLLECTION = "search";

	public void createNewSearch(Search search) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", search.getUser().getUserName())
				.append("searchName", search.getSearchName()).append("trackterms", search.getTrackterms());
		db.addToCollection(SEARCH_COLLECTION, doc);
		db.closeDb();
	}

	public ArrayList<Search> getSearches(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName());
		FindIterable<Document> documents = db.findAll(SEARCH_COLLECTION, doc);
		ArrayList<Search> searches = new ArrayList<Search>();
		for (Document document : documents) {
			Search search = new Search();
			search.setUser(new User(document.getString("userName")));
			search.setSearchName(document.getString("searchName"));
			search.setTrackterms(document.getString("trackTerms").split(","));
			searches.add(search);
		}
		return searches;
	}

}
