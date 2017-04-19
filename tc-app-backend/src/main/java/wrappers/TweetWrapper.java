package wrappers;

import java.io.Serializable;
import java.util.ArrayList;

import domains.Tweet;

public class TweetWrapper implements Serializable {

	private static final long serialVersionUID = 1L;
	private ArrayList<Tweet> tweets;

	public TweetWrapper() {

	}

	public TweetWrapper(ArrayList<Tweet> tweets) {
		this.tweets = tweets;
	}

	public ArrayList<Tweet> getTweets() {
		return tweets;
	}

	public void setTweets(ArrayList<Tweet> tweets) {
		this.tweets = tweets;
	}

}
