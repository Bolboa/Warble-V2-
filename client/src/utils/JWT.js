import API from "./API";

const verify = (jwt) => {

  // Define the headers.
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Authorization", jwt);
    
  // Define the REST API.
  const api = new API({ url: process.env.API_URL + "/users" });
      
  // Define the route.
  api.create_entity({ name: "verify" }, headers);
    
  // Create user.
  api.endpoints.verify.create({ data: "" })
    .then(response => response.json())
    .then(json_response => {

      if ([4,5].includes(json_response.statusCode / 100)) {
        
        // Define and throw the error.
        let err = new Error("HTTP status code: " + json_response.statusCode);
        err.response = json_response;
        err.status = json_response.statusCode;
        throw err;

      }

    })
    .catch(err => {
      throw err;
    });
  
  return true;

}

export default verify;