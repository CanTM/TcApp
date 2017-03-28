package services;

import java.util.ArrayList;

import org.bson.Document;

import com.mongodb.client.FindIterable;

import domains.Search;
import domains.User;
import util.DbCommunication;

public class SearchService {

	private static String SEARCH_COLLECTION = "search";

	public boolean createNewSearch(Search search) {
		DbCommunication db = new DbCommunication();
		boolean newSearchCreated = false;
		if (getSearch(search) != null) {
			Document doc = new Document("username", search.getUser().getUserName())
					.append("searchName", search.getSearchName()).append("trackterms", search.getTrackterms());
			db.addToCollection(SEARCH_COLLECTION, doc);
			newSearchCreated = true;
		}
		db.closeDb();
		return newSearchCreated;
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
		db.closeDb();
		return searches;
	}

	public Search getSearch(Search search) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", search.getUser().getUserName()).append("searchName",
				search.getSearchName());
		Search searchFound = new Search();
		Document document = db.findOne(SEARCH_COLLECTION, doc);

		if (document != null) {
			searchFound.setUser(new User(document.getString("userName")));
			searchFound.setSearchName(document.getString("searchName"));
			searchFound.setTrackterms(document.getString("trackTerms").split(","));
		}
		db.closeDb();
		return searchFound;
	}

}
