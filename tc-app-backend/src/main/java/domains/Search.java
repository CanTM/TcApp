package domains;

import java.io.Serializable;

public class Search implements Serializable {

	private static final long serialVersionUID = 1L;
	private User user;
	private String searchName;
	private String trackterms;
	private String languages;

	public Search() {

	}

	public Search(User user, String searchName) {
		this.user = user;
		this.searchName = searchName;
	}

	public Search(User user, String searchName, String trackterms, String languages) {
		this.user = user;
		this.searchName = searchName;
		this.trackterms = trackterms;
		this.languages = languages;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getSearchName() {
		return searchName;
	}

	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}

	public String getTrackterms() {
		return trackterms;
	}

	public void setTrackterms(String trackterms) {
		this.trackterms = trackterms;
	}

	public String getLanguages() {
		return languages;
	}

	public void setLanguages(String languages) {
		this.languages = languages;
	}

	@Override
	public String toString() {
		return "Search [user=" + user + ", searchName=" + searchName + ", trackterms=" + trackterms + ", languages="
				+ languages + "]";
	}

}
