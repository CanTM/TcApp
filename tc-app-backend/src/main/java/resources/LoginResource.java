package resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import domains.User;
import services.LoginService;

@Path("login")
public class LoginResource {

	@POST
	@Path("newUser")
	@Consumes("application/x-www-form-urlencoded")
	@Produces("text/plain")
	public String createNewUser(@FormParam("userName") String userName, @FormParam("password") String password) {
		LoginService login = new LoginService();
		return login.createNewUser(new User(userName, password));
	}

	@GET
	@Path("autenticate")
	@Produces("text/plain")
	public String autenticate(@QueryParam("userName") String userName, @QueryParam("password") String password) {
		LoginService login = new LoginService();
		return login.findUser(new User(userName, password));
	}

}
