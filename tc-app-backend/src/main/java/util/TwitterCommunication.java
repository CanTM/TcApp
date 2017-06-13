package util;

import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import com.google.common.collect.Lists;
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

	public Client buildSearchClient(Search search) {
		List<String> terms = Lists.newArrayList(search.getTrackterms().split(", "));
		hosebirdEndpoint.trackTerms(terms);

		if (search.getLanguages() != null) {
			List<String> languages = Lists.newArrayList(search.getLanguages().split(", "));
			hosebirdEndpoint.languages(languages);
		}

		ClientBuilder builder = new ClientBuilder().name(search.getSearchName()).hosts(hosebirdHosts)
				.authentication(hosebirdAuth).endpoint(hosebirdEndpoint)
				.processor(new StringDelimitedProcessor(msgQueue)).eventMessageQueue(eventQueue);
		Client hosebirdClient = builder.build();
		return hosebirdClient;
	}

	public String connectClient(Client client, Search search, int timeInterval) throws InterruptedException {
		HashMap<String, Integer> hashtagsMap = new HashMap<String, Integer>();
		client.connect();
		int nroTweets = 0;
		long endTime = System.currentTimeMillis() + timeInterval;
		System.out.println("Vou entrar no client");
		while (!client.isDone() && System.currentTimeMillis() < endTime) {
			// DbCommunication db = new DbCommunication();
			// MongoCollection<Document> collection =
			// db.getDatabase().getCollection("tweets");
			System.out.println("Antes do take" + nroTweets);
			String msg = msgQueue.take();
			System.out.println(msg);
			if (msg.contains("\"hashtags\"")) {
				int index1 = msg.indexOf("\"hashtags\"");
				int index2 = msg.indexOf("\"urls\"");
				String hashtagsString = msg.substring(index1 + 12, index2 - 2);
				System.out.println(hashtagsString);
				String[] stringsArray = null;
				if (!hashtagsString.isEmpty() && hashtagsString.contains("},")) {
					stringsArray = hashtagsString.split("},");
				} else if (!hashtagsString.isEmpty() && hashtagsString.contains("}")) {
					stringsArray = hashtagsString.split("},");
				}
				if (stringsArray != null && stringsArray.length > 0) {
					for (String element : stringsArray) {
						System.out.println(element);
						int index3 = element.indexOf("\"text\"");
						int index4 = element.indexOf("\"indices\"");
						String hashtagFiltered = element.substring(index3 + 8, index4 - 2);
						System.out.println("hashtag: " + hashtagFiltered);
						if (hashtagsMap.containsKey(hashtagFiltered)) {
							Integer nroOcorrencias = hashtagsMap.get(hashtagFiltered);
							hashtagsMap.put(hashtagFiltered, nroOcorrencias + 1);
						} else {
							hashtagsMap.put(hashtagFiltered, 1);
						}
					}
				}
			}

			// Document doc = new Document("tweet", msg).append("userName",
			// search.getUser().getUserName())
			// .append("searchName", search.getSearchName());
			// collection.insertOne(doc);
			nroTweets++;
			System.out.println(nroTweets);
			// db.closeDb();
		}
		client.stop();
		System.out.println("Saí do client: " + nroTweets);

		// "hashtags":[{"text":"PrincipeEngin","indices":[38,52]},{"text":"Daghan","indices":[53,60]},{"text":"Selvi","indices":[61,67]}]

		boolean haveHashtags = false;
		StringBuilder sb = new StringBuilder();
		sb.append("{\"nroTweets\": " + nroTweets + ",");
		sb.append("\"hashtags\":[");
		for (Entry<String, Integer> entry : hashtagsMap.entrySet()) {
			haveHashtags = true;
			sb.append("{\"hashtag\":\"" + entry.getKey() + "\", \"frequencia\":" + entry.getValue() + "},");
		}
		if (haveHashtags) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]}");

		System.out.println(sb.toString());
		return sb.toString();

	}
}
