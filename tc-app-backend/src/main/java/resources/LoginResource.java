package resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

import domains.User;
import services.LoginService;

@Path("/login")
public class LoginResource {

	@POST
	@Path("/newUser")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public void createNewUser(User user) {
		LoginService login = new LoginService();
		login.createNewUser(user);
	}

	@GET
	@Path("/autenticate")
	public boolean autenticate(User user) {
		LoginService login = new LoginService();
		return login.findUser(user);
	}
}
