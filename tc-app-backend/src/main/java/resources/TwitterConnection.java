package resources;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.bson.Document;

import com.google.common.collect.Lists;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
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

public class TwitterConnection {

	public static void main(String[] args) throws InterruptedException {

		/**
		 * Set up your blocking queues: Be sure to size these properly based on
		 * expected TPS of your stream
		 */
		BlockingQueue<String> msgQueue = new LinkedBlockingQueue<String>(100000);
		BlockingQueue<Event> eventQueue = new LinkedBlockingQueue<Event>(1000);

		/**
		 * Declare the host you want to connect to, the endpoint, and
		 * authentication (basic auth or oauth)
		 */
		Hosts hosebirdHosts = new HttpHosts(Constants.STREAM_HOST);
		StatusesFilterEndpoint hosebirdEndpoint = new StatusesFilterEndpoint();
		// Optional: set up some followings and track terms
		List<Long> followings = Lists.newArrayList(1234L, 566788L);
		List<String> terms = Lists.newArrayList("twitter", "api");
		hosebirdEndpoint.followings(followings);
		hosebirdEndpoint.trackTerms(terms);

		// These secrets should be read from a config file
		Authentication hosebirdAuth = new OAuth1("61EhNdDqi9n8euVHLmgmzwKWS",
				"MttU1QuL5BhAZZfJBZbuRq0hJ9X9P35npQk81arSDVOAe2wYwh",
				"762332170040008705-Gs8p28exE4OO08E1Fe7czRHxRWdOBAI", "vUj1nYZl0oOb3JjIVowwEUNf2GLXT4Z8yDJAWqnsEhUzp");

		ClientBuilder builder = new ClientBuilder().name("Hosebird-Client-01").hosts(hosebirdHosts)
				.authentication(hosebirdAuth).endpoint(hosebirdEndpoint)
				.processor(new StringDelimitedProcessor(msgQueue)).eventMessageQueue(eventQueue);
		Client hosebirdClient = builder.build();

		// Attempts to establish a connection.
		hosebirdClient.connect();

		MongoClient mongoClient = new MongoClient();
		MongoDatabase database = mongoClient.getDatabase("TcApp");
		MongoCollection<Document> collection = database.getCollection("tweets");

		int count = 0;

		while (!hosebirdClient.isDone() && count < 50) {
			String msg = msgQueue.take();
			Document doc = new Document("tweet", msg);
			collection.insertOne(doc);
			count++;
			System.out.println(msg);
		}

		mongoClient.close();
	}

}
