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

@Path("/login")
@Consumes("text/plain")
@Produces("text/plain")
public class LoginResource {

	@POST
	@Path("/newUser")
	@Consumes("application/x-www-form-urlencoded")
	public void createNewUser(@FormParam("userName") String userName, @FormParam("password") String password) {
		LoginService login = new LoginService();
		login.createNewUser(new User(userName, password));
	}

	@GET
	@Path("/autenticate")
	public String autenticate(@QueryParam("userName") String userName, @QueryParam("password") String password) {
		LoginService login = new LoginService();
		boolean isAutenticated = login.findUser(new User(userName, password));
		if (isAutenticated) {
			return "ok";
		} else {
			return "fail";
		}
	}
}
