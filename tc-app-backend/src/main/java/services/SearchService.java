package services;

import java.util.ArrayList;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.twitter.hbc.core.Client;

import domains.Search;
import domains.Tweet;
import domains.User;
import util.DbCommunication;
import util.TwitterCommunication;

public class SearchService {

	private static String SEARCH_COLLECTION = "search";

	public boolean createNewSearch(Search search) {
		DbCommunication db = new DbCommunication();
		boolean newSearchCreated = false;
		if (getSearch(search) != null) {
			Document doc = new Document("userName", search.getUser().getUserName())
					.append("searchName", search.getSearchName()).append("trackTerms", search.getTrackterms());
			MongoCollection<Document> collection = db.getDatabase().getCollection(SEARCH_COLLECTION);
			collection.insertOne(doc);
			db.closeDb();
			newSearchCreated = true;
		}
		db.closeDb();
		return newSearchCreated;
	}

	public String getSearches(User user) {
		DbCommunication db = new DbCommunication();
		Document doc = new Document("username", user.getUserName());
		FindIterable<Document> documents = db.findAll(SEARCH_COLLECTION, doc);
		ArrayList<Search> searches = new ArrayList<Search>();
		StringBuilder sb = new StringBuilder();
		for (Document document : documents) {
			sb.append(document.toJson());
			Search search = new Search();
			search.setUser(new User(document.getString("userName")));
			search.setSearchName(document.getString("searchName"));
			search.setTrackterms(document.getString("trackTerms").split(","));
			searches.add(search);
		}
		db.closeDb();
		return sb.toString();
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

	public ArrayList<Tweet> search(Search search, int timeInterval) throws InterruptedException {
		TwitterCommunication tc = new TwitterCommunication();
		Search startSearch = getSearch(search);
		Client client = tc.buildSearchClient(search.getSearchName(), startSearch.getTrackterms());
		tc.connectClient(client, startSearch, timeInterval);
		DbCommunication db = new DbCommunication();
		Document doc = new Document("userName", search.getUser().getUserName()).append("searchName",
				search.getSearchName());
		FindIterable<Document> documents = db.findAll("tweets", doc);
		ArrayList<Tweet> tweets = new ArrayList<Tweet>();
		for (Document document : documents) {
			Tweet tweet = new Tweet();
			tweet.setUsername(document.getString("userName"));
			tweet.setSearchName(document.getString("searchName"));
			tweet.setTweetMessage(document.getString("tweet"));
			tweets.add(tweet);
		}
		db.closeDb();
		return tweets;
	}

}
