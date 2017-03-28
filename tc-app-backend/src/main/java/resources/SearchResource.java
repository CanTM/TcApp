package resources;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

import domains.Search;
import services.SearchService;

@Path("search")
public class SearchResource {

	@POST
	@Path("newSearch")
	public void createNewSearch(Search search) {
		SearchService searchService = new SearchService();
		searchService.createNewSearch(search);
	}
}
