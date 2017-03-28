package services;

import org.bson.Document;

import domains.Search;
import domains.User;
import util.DbCommunication;
import wrappers.SearchWrapper;

public class SearchService {

	private static String SEARCH_COLLECTION = "search";

	public void createNewSearch(Search search) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", search.getUser().getUserName())
				.append("searchName", search.getSearchName()).append("trackterms", search.getTrackterms());
		db.addToCollection(SEARCH_COLLECTION, doc);
		db.closeDb();
	}

	public SearchWrapper getSearches(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName());
		db.findAll(SEARCH_COLLECTION, doc);
		return null;
	}

}
