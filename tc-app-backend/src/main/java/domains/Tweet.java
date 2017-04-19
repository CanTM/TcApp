package domains;

import java.io.Serializable;

public class Tweet implements Serializable {

	private static final long serialVersionUID = 1L;
	private String searchName;
	private String username;
	private String tweetMessage;

	public Tweet(String searchName, String username, String tweetMessage) {
		this.searchName = searchName;
		this.username = username;
		this.tweetMessage = tweetMessage;
	}

	public Tweet() {

	}

	public String getSearchName() {
		return searchName;
	}

	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getTweetMessage() {
		return tweetMessage;
	}

	public void setTweetMessage(String tweetMessage) {
		this.tweetMessage = tweetMessage;
	}
}
