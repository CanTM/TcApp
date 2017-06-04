package services;

import com.twitter.hbc.core.Client;

import domains.Search;
import util.TwitterCommunication;

public class SearchService {

	/*
	 * private static String SEARCH_COLLECTION = "search"; private static String
	 * USER_NAME = "userName"; private static String SEARCH_NAME = "searchName";
	 * private static String TRACK_TERMS = "trackTerms"; private static String
	 * LANGUAGES = "languages"; private static String TWEETS = "tweets"; private
	 * static String LINE = "line"; private static String TIME_INTERVAL =
	 * "timeInterval"; private static String INITIAL_TIME = "initialTime";
	 * 
	 * public String createNewSearch(Search search) { DbCommunication db = new
	 * DbCommunication(); FindIterable<Document> document =
	 * db.findOne(SEARCH_COLLECTION, new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()));
	 * 
	 * Document doc = new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()); MongoCollection<Document> collection =
	 * db.getDatabase().getCollection(SEARCH_COLLECTION); if (document.first()
	 * == null) { doc = new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()) .append(TRACK_TERMS,
	 * search.getTrackterms()).append(LANGUAGES, search.getLanguages());
	 * collection.insertOne(doc); } else { collection.updateOne(
	 * Filters.and(Filters.eq(SEARCH_NAME, search.getSearchName()),
	 * Filters.eq(USER_NAME, search.getUser().getUserName())), new
	 * Document("$set", new Document(TRACK_TERMS,
	 * search.getTrackterms()).append(LANGUAGES, search.getLanguages()))); } doc
	 * = new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()); String newSearch = db.findOne(SEARCH_COLLECTION,
	 * doc).first().toJson();
	 * 
	 * db.closeDb();
	 * 
	 * return newSearch; }
	 * 
	 * public String getSearches(User user) { DbCommunication db = new
	 * DbCommunication(); Document doc = new Document(USER_NAME,
	 * user.getUserName()); FindIterable<Document> documents =
	 * db.findAll(SEARCH_COLLECTION, doc); StringBuilder sb = new
	 * StringBuilder(); for (Document document : documents) {
	 * sb.append(document.toJson()); } db.closeDb(); return sb.toString(); }
	 * 
	 * public String getSearch(Search search) { DbCommunication db = new
	 * DbCommunication(); Document doc = new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()); String searchFound =
	 * db.findOne(SEARCH_COLLECTION, doc).first().toJson(); db.closeDb(); return
	 * searchFound; }
	 */

	public int search(Search search, int timeInterval) throws InterruptedException {
		TwitterCommunication tc = new TwitterCommunication();
		Client client = tc.buildSearchClient(search);
		int nroTweets = tc.connectClient(client, search, timeInterval);
		// saveLinePoints(search, nroTweets, timeInterval);
		return nroTweets;
	}

	/*
	 * public String getTweets(Search search) { DbCommunication db = new
	 * DbCommunication(); Document doc = new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()); FindIterable<Document> documents =
	 * db.findAll(TWEETS, doc); StringBuilder sb = new StringBuilder(); for
	 * (Document document : documents) { sb.append(document.toJson()); }
	 * db.closeDb(); return sb.toString(); }
	 * 
	 * public void saveLinePoints(Search search, int nroTweets, int
	 * timeInterval) { DbCommunication db = new DbCommunication();
	 * FindIterable<Document> document = db.findOne(LINE, new
	 * Document(USER_NAME, search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName())); MongoCollection<Document> collection =
	 * db.getDatabase().getCollection(LINE); Document doc = new Document(); if
	 * (document.first() == null) { doc = new Document(USER_NAME,
	 * search.getUser().getUserName()).append(SEARCH_NAME,
	 * search.getSearchName()) .append(LINE, nroTweets).append(TIME_INTERVAL,
	 * timeInterval) .append(INITIAL_TIME, Calendar.getInstance().getTime());
	 * collection.insertOne(doc); } else { String addToLine =
	 * document.first().get(LINE) + ", " + nroTweets; collection.updateOne(
	 * Filters.and(Filters.eq(SEARCH_NAME, search.getSearchName()),
	 * Filters.eq(USER_NAME, search.getUser().getUserName())), new
	 * Document("$set", new Document(LINE, addToLine))); } db.closeDb(); }
	 */
}
