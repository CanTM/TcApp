package resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import domains.Search;
import domains.User;
import services.SearchService;

@Path("search")
public class SearchResource {

	@POST
	@Path("newSearch")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("text/plain")
	public String createNewSearch(@FormParam("userName") String userName, @FormParam("searchName") String searchName,
			@FormParam("trackTerms") String trackTerms) {
		SearchService searchService = new SearchService();
		return searchService.createNewSearch(new Search(new User(userName), searchName, trackTerms));
	}

	@GET
	@Path("allSearches")
	@Produces("text/plain")
	public String getSearches(@QueryParam("userName") String userName) {
		SearchService searchService = new SearchService();
		return searchService.getSearches(new User(userName));
	}

	@GET
	@Produces("text/plain")
	public String getSearch(@QueryParam("userName") String userName, @QueryParam("searchName") String searchName) {
		SearchService searchService = new SearchService();
		return searchService.getSearch(new Search(new User(userName), searchName));
	}

	@GET
	@Path("/startSearch")
	public String search(@QueryParam("userName") String userName, @QueryParam("searchName") String searchName,
			@QueryParam("trackTerms") String trackTerms, @QueryParam("timeInterval") int timeInterval)
			throws InterruptedException {
		SearchService searchService = new SearchService();
		return searchService.search(new Search(new User(userName), searchName, trackTerms), timeInterval);
	}

}
