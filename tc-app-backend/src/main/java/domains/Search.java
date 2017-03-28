package domains;

import java.io.Serializable;
import java.util.Arrays;

public class Search implements Serializable {

	private static final long serialVersionUID = 1L;
	private User user;
	private String searchName;
	private String[] trackterms;

	public Search() {

	}

	public Search(User user, String searchName) {
		this.user = user;
		this.searchName = searchName;
	}

	public Search(User user, String searchName, String[] trackterms) {
		this.user = user;
		this.searchName = searchName;
		this.trackterms = trackterms;
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

	public String[] getTrackterms() {
		return trackterms;
	}

	public void setTrackterms(String[] trackterms) {
		this.trackterms = trackterms;
	}

	@Override
	public String toString() {
		return "Search [user=" + user + ", searchName=" + searchName + ", trackterms=" + Arrays.toString(trackterms)
				+ "]";
	}

}
