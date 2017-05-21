package services;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import com.twitter.hbc.core.Client;

import domains.Search;
import domains.User;
import util.DbCommunication;
import util.TwitterCommunication;

public class SearchService {

	private static String SEARCH_COLLECTION = "search";
	private static String USER_NAME = "userName";
	private static String SEARCH_NAME = "searchName";
	private static String TRACK_TERMS = "trackTerms";
	private static String LANGUAGES = "languages";
	private static String TWEETS = "tweets";

	public String createNewSearch(Search search) {
		DbCommunication db = new DbCommunication();
		FindIterable<Document> document = db.findOne(SEARCH_COLLECTION,
				new Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME, search.getSearchName()));

		Document doc = new Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME,
				search.getSearchName());
		MongoCollection<Document> collection = db.getDatabase().getCollection(SEARCH_COLLECTION);
		if (document.first() == null) {
			doc = new Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME, search.getSearchName())
					.append(TRACK_TERMS, search.getTrackterms()).append(LANGUAGES, search.getLanguages());
			collection.insertOne(doc);
		} else {
			collection.updateOne(
					Filters.and(Filters.eq(SEARCH_NAME, search.getSearchName()),
							Filters.eq(USER_NAME, search.getUser().getUserName())),
					new Document("$set", new Document(TRACK_TERMS, search.getTrackterms()).append(LANGUAGES,
							search.getLanguages())));
		}
		doc = new Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME, search.getSearchName());
		String newSearch = db.findOne(SEARCH_COLLECTION, doc).first().toJson();

		db.closeDb();

		return newSearch;
	}

	public String getSearches(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document(USER_NAME, user.getUserName());
		FindIterable<Document> documents = db.findAll(SEARCH_COLLECTION, doc);
		StringBuilder sb = new StringBuilder();
		for (Document document : documents) {
			sb.append(document.toJson());
		}
		db.closeDb();
		return sb.toString();
	}

	public String getSearch(Search search) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME,
				search.getSearchName());
		String searchFound = db.findOne(SEARCH_COLLECTION, doc).first().toJson();
		db.closeDb();
		return searchFound;
	}

	public String search(Search search, int timeInterval) throws InterruptedException {
		TwitterCommunication tc = new TwitterCommunication();
		Client client = tc.buildSearchClient(search);
		tc.connectClient(client, search, timeInterval);
		DbCommunication db = new DbCommunication();
		Document doc = new Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME,
				search.getSearchName());
		FindIterable<Document> documents = db.findAll(TWEETS, doc);
		StringBuilder sb = new StringBuilder();
		for (Document document : documents) {
			sb.append(document.toJson());
		}
		db.closeDb();
		return sb.toString();
	}

}
