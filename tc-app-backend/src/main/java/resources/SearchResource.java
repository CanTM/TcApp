package resources;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import domains.Search;
import domains.User;
import services.SearchService;
import wrappers.SearchWrapper;

@Path("search")
public class SearchResource {

	@POST
	@Path("newSearch")
	public boolean createNewSearch(Search search) {
		SearchService searchService = new SearchService();
		return searchService.createNewSearch(search);
	}

	@GET
	@Path("/allSearches/{userName}")
	public SearchWrapper getSearches(User user) {
		SearchService searchService = new SearchService();
		return new SearchWrapper(searchService.getSearches(user));
	}

	@GET
	public Search getSearch(Search search) {
		SearchService searchService = new SearchService();
		return searchService.getSearch(search);
	}

}
