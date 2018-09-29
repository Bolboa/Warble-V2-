import API from "./API";

const verify = (jwt) => {
    
    // Define the REST API.
    const api = new API({ url: process.env.API_URL + "/users" });
      
    // Define the route.
    api.create_entity({ name: "verify" });
    
    // Create user.
    api.endpoints.register.create({ data: jwt });

    


}