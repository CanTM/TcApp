package resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

import business.Login;

@Path("/login")
public class LoginResource {

	@GET
	@Path("/autenticate")
	public void autenticate(@QueryParam(value = "username") String username,
			@QueryParam(value = "password") String password) {
		Login login = new Login();
		login.createNewUser(username, password);
	}
}
