package resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import domains.User;
import services.SearchService;

@Path("search")
public class SearchResource {

	/*
	 * @POST
	 * 
	 * @Path("newSearch")
	 * 
	 * @Consumes(MediaType.MULTIPART_FORM_DATA) public boolean
	 * createNewSearch(FormDataContentDisposition formParams) { String
	 * trackTerms = formParams.getParameters().get("trackTerms");
	 * 
	 * SearchService searchService = new SearchService(); return
	 * searchService.createNewSearch(new Search(new
	 * User(formParams.getParameters().get("userName")),
	 * formParams.getParameters().get("searchName"), trackTerms)); }
	 */

	@GET
	@Path("/allSearches/{userName}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getSearches(String userName) {
		SearchService searchService = new SearchService();
		return searchService.getSearches(new User(userName));
	}

	/*
	 * @GET public Search getSearch(@QueryParam("userName") String
	 * userName, @QueryParam("searchName") String searchName) { SearchService
	 * searchService = new SearchService(); return searchService.getSearch(new
	 * Search(new User(userName), searchName)); }
	 *
	 * @GET
	 *
	 * @Path("/startSearch") public TweetWrapper search(@QueryParam("userName")
	 * String userName, @QueryParam("searchName") String searchName,
	 *
	 * @QueryParam("timeInterval") int timeInterval) throws InterruptedException
	 * { SearchService searchService = new SearchService(); ArrayList<Tweet>
	 * tweets = searchService.search(new Search(new User(userName), searchName),
	 * timeInterval); return new TweetWrapper(tweets); }
	 */

}
