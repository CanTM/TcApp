package wrappers;

import java.io.Serializable;
import java.util.ArrayList;

import domains.Search;

public class SearchWrapper implements Serializable {

	private static final long serialVersionUID = 1L;
	private ArrayList<Search> searches;

	public SearchWrapper() {

	}

	public SearchWrapper(ArrayList<Search> searches) {
		this.searches = searches;
	}

	public ArrayList<Search> getSearches() {
		return searches;
	}

	public void setSearches(ArrayList<Search> searches) {
		this.searches = searches;
	}

}
