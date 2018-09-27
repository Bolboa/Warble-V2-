import React, { Component } from "react";
import FormValidator from "../../utils/FormValidator";
import * as DefaultValidations from "../../utils/DefaultValidations";
import API from "../../utils/API";


class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form_inputs: {
        email: "",
        username: "",
        password: "",
        password_retype: ""
      },
      em_verify: false,
      username_verify: false,
      pass_verify: false,
      pass_retype_verify: false,
      server_err_msg: ""
    }
    
    // Form validator to be called when a form is submitted.
    this.validator = new FormValidator([
      {
        field: "email",
        method: "is_empty",
        valid_when: false,
        message: "Email cannot be empty."
      },
      { 
        field: "email", 
        method: "regex_validation",
        args: { 
          regex: "email", 
          cs: false 
        },
        valid_when: true, 
        message: "Invalid Email." 
      },
      { 
        field: "username", 
        method: "is_empty", 
        valid_when: false, 
        message: "Username cannot be empty."
      },
      { 
        field: "username", 
        method: "size_check",
        args: { size:2 }, 
        valid_when: false, 
        message: "Username must be at least 2 characters long."
      },
      { 
        field: "password", 
        method: "is_empty", 
        valid_when: false, 
        message: "Password cannot be empty."
      },
      { 
        field: "password", 
        method: "regex_validation",
        args: { regex: "password" }, 
        valid_when: true, 
        message: "Invalid Password."
      },
      { 
        field: "password_retype", 
        method: "is_empty", 
        valid_when: false, 
        message: "Password does not match."
      },
      { 
        field: "password_retype", 
        method: "password_match", 
        valid_when: true, 
        message: "Password does not match."
      }
      
    ]);
  }


  /*
  Verify field whenever the input changes.
  */
  verifiy = (field, value) => {
    
    // All states hold the input validation status.
    let em_verify = this.state.em_verify;
    let username_verify = this.state.username_verify;
    let pass_verify = this.state.pass_verify;
    let pass_retype_verify = this.state.pass_retype_verify;
    
    // Validate the currently active input.
    switch(field) {
      
      case "email":
        
        // Validate the email against a regex.
        em_verify = DefaultValidations.regex_validation(value, { regex: "email", cs: false });
        em_verify ? this.setState({ em_verify: true }) : this.setState({ em_verify: false });
        
        break;
    
      case "username":

        // Ensure the username length is at least 2 characters.
        username_verify = !DefaultValidations.size_check(value, { size: 2 });
        username_verify ? this.setState({ username_verify: true }) : this.setState({ username_verify: false });
        
        break;

      case "password":
        
        // Validate the password against a regex.
        pass_verify = DefaultValidations.regex_validation(value, { regex: "password" });
        
        // Check if the re-typed password exists and whether it equals the current password.
        pass_retype_verify = !DefaultValidations.is_empty(this.state.form_inputs.password_retype) && value === this.state.form_inputs.password_retype;

        // Password is valid and the re-typed password is equal to the password.
        pass_verify && pass_retype_verify ? this.setState({ pass_retype_verify: true}) : this.setState({ pass_retype_verify: false });
        
        // Password is not valid then neither is the re-typed password.
        pass_verify ? this.setState({ pass_verify: true}) : this.setState({ pass_verify: false, pass_retype_verify: false });
        
        break;

      case "password_retype":

        // Check if re-typed password equals the current password and that the field is not empty.
        pass_retype_verify = DefaultValidations.password_match(value, this.state.form_inputs) && value.length > 0 && this.state.pass_verify;
        pass_retype_verify ? this.setState({ pass_retype_verify: true }) : this.setState({ pass_retype_verify: false });
        
        break;

    }

  }


  /*
  Update the state for form inputs as a user types in an input.
  */
  handle_change = (e) => {

    // Make a copy of the state object and update it.
    let new_form = Object.assign({}, this.state.form_inputs);
    new_form[e.target.name] = e.target.value;

    // Update the state itself with the new state.
    this.setState({ form_inputs: new_form });

    // Verify that the input is in the correct format
    // for every key event.
    this.verifiy(e.target.name, e.target.value);

  }

  /*
  Submit the form.
  */
  submit_handler = (e) => {
    
    e.preventDefault();

    let form_validation = this.validator.validate(this.state.form_inputs);
    let form_data = this.validator.get_values(["password_retype"]);
    if (form_validation.is_valid) {
      //console.log(form_data);
      const api = new API({ url: "http://localhost:3000/users" });
      api.create_entity({ name: "register" });
      api.endpoints.register.create({ data: form_data })
        .then(response => {
          return response.json()
        })
        .then(json_response => {
          console.log(json_response);
          if ([4,5].includes(json_response.statusCode / 100)) {
            this.setState({ server_err_msg: json_response.message });
            let err = new Error("HTTP status code: " + json_response.statusCode);
            err.response = json_response;
            err.status = json_response.statusCode;
            throw err;
          }
          this.props.history.push("/verify", { ok: true });
        });
    }

  }

  
  render() {
    return (
      <form ref={ form => this.register_form = form } onSubmit={ (e) => this.submit_handler(e) }>
        <input
          type="text"
          name="email"
          onChange={ (e) => this.handle_change(e) }
        />
        <label>
          {this.state.em_verify ? <p>YES</p> : <p>NO</p>}
        </label>
        <input
          type="text"
          name="username"
          onChange={ (e) => this.handle_change(e) }
        />
        <label>
          {this.state.username_verify ? <p>YES</p> : <p>NO</p>}
        </label>
        <input
          type="text"
          name="password"
          onChange={ (e) => this.handle_change(e) }
        />
        <label>
          {this.state.pass_verify ? <p>YES</p> : <p>NO</p>}
        </label>
        <input
          type="text"
          name="password_retype"
          onChange={ (e) => this.handle_change(e) }
        />
        <label>
          {this.state.pass_retype_verify ? <p>YES</p> : <p>NO</p>}
        </label>
        <input type="submit" />
        <label>{ this.state.server_err_msg }</label>
      </form>
    );
  }
}

export default Register;