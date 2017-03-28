package resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import business.Login;

@Path("/login")
public class LoginResource {

	@POST
	@Path("/newUser")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public void createNewUser(@FormParam("username") String username, @FormParam("password") String password) {
		Login login = new Login();
		login.createNewUser(username, password);
	}

	@GET
	@Path("/autenticate")
	public boolean autenticate(@QueryParam(value = "username") String username,
			@QueryParam(value = "password") String password) {
		Login login = new Login();
		return login.findUser(username, password);
	}
}
