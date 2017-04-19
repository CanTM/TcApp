package util;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.bson.Document;

import com.google.common.collect.Lists;
import com.mongodb.client.MongoCollection;
import com.twitter.hbc.ClientBuilder;
import com.twitter.hbc.core.Client;
import com.twitter.hbc.core.Constants;
import com.twitter.hbc.core.Hosts;
import com.twitter.hbc.core.HttpHosts;
import com.twitter.hbc.core.endpoint.StatusesFilterEndpoint;
import com.twitter.hbc.core.event.Event;
import com.twitter.hbc.core.processor.StringDelimitedProcessor;
import com.twitter.hbc.httpclient.auth.Authentication;
import com.twitter.hbc.httpclient.auth.OAuth1;

import domains.Search;

public class TwitterCommunication {

	private BlockingQueue<String> msgQueue;
	private BlockingQueue<Event> eventQueue;
	private Hosts hosebirdHosts;
	private StatusesFilterEndpoint hosebirdEndpoint;
	private Authentication hosebirdAuth;

	public TwitterCommunication() {
		msgQueue = new LinkedBlockingQueue<String>(100000);
		eventQueue = new LinkedBlockingQueue<Event>(1000);
		hosebirdHosts = new HttpHosts(Constants.STREAM_HOST);
		hosebirdEndpoint = new StatusesFilterEndpoint();
		hosebirdAuth = new OAuth1("61EhNdDqi9n8euVHLmgmzwKWS", "MttU1QuL5BhAZZfJBZbuRq0hJ9X9P35npQk81arSDVOAe2wYwh",
				"762332170040008705-Gs8p28exE4OO08E1Fe7czRHxRWdOBAI", "vUj1nYZl0oOb3JjIVowwEUNf2GLXT4Z8yDJAWqnsEhUzp");
	}

	public Client buildSearchClient(String searchName, String... searchTerms) {
		List<String> terms = Lists.newArrayList(searchTerms);
		hosebirdEndpoint.trackTerms(terms);
		ClientBuilder builder = new ClientBuilder().name(searchName).hosts(hosebirdHosts).authentication(hosebirdAuth)
				.endpoint(hosebirdEndpoint).processor(new StringDelimitedProcessor(msgQueue))
				.eventMessageQueue(eventQueue);
		Client hosebirdClient = builder.build();
		return hosebirdClient;
	}

	public void connectClient(Client client, Search search, int timeInterval) throws InterruptedException {
		DbCommunication db = new DbCommunication();
		MongoCollection<Document> collection = db.getDatabase().getCollection("tweets");
		client.connect();

		long endTime = System.currentTimeMillis() + timeInterval;

		while (!client.isDone() && System.currentTimeMillis() < endTime) {
			String msg = msgQueue.take();
			Document doc = new Document("tweet", msg).append("userName", search.getUser().getUserName())
					.append("searchName", search.getSearchName());
			collection.insertOne(doc);
		}
		db.closeDb();
	}
}
