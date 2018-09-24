import React, { Component } from "react";
import FormValidator from "./FormValidator";

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
      pass_retype_verify: false
    }

    this.regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.regex_password = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*\-_]).{6,}$/;

    this.validator = new FormValidator([
      {
        field: "email",
        method: this.is_empty,
        valid_when: false,
        message: "Email cannot be empty."
      },
      { 
        field: "email", 
        method: this.regex_validation,
        args: 
        { regex: this.regex_email, 
          cs: false },
        valid_when: true, 
        message: "Invalid Email." 
      },
      { 
        field: "username", 
        method: this.is_empty, 
        valid_when: false, 
        message: "Username cannot be empty."
      },
      { 
        field: "username", 
        method: this.size_check,
        args: { size:2 }, 
        valid_when: false, 
        message: "Username must be at least 2 characters long."
      },
      { 
        field: "password", 
        method: this.is_empty, 
        valid_when: false, 
        message: "Password cannot be empty."
      },
      { 
        field: "password", 
        method: this.regex_validation,
        args: { regex: this.regex_password }, 
        valid_when: true, 
        message: "Invalid Password."
      },
      { 
        field: "password_retype", 
        method: this.is_empty, 
        valid_when: true, 
        message: "Password does not match."
      },
      { 
        field: "password_retype", 
        method: this.password_match, 
        valid_when: true, 
        message: "Password does not match."
      }
      
    ]);
  }

  is_empty = (confirmation) => (confirmation.length == 0);
  password_match = (confirmation, state) => (confirmation === state.password);
  size_check = (confirmation, context) => (confirmation.length < context.size);
  regex_validation = (confirmation, context) => {
    if (context.cs == false) return context.regex.test(String(confirmation).toLowerCase());
    else return context.regex.test(String(confirmation));
  }

  componentDidMount() {
    //let valid = this.validator.validate(this.state.form_inputs);
    //console.log(valid);
  }


  verifiy = (field, value) => {
    if (field == "email") {
      if (this.regex_validation(value, { regex: this.regex_email, cs: false })) {
        this.setState({ em_verify: true });
      }
      else {
        this.setState({ em_verify: false });
      }
    }
    else if (field == "username") {
      if (!this.size_check(value, { size: 2 })) {
        this.setState({ username_verify: true });
      }
      else {
        this.setState({ username_verify: false });
      }
    }
    else if (field == "password") {
      if (this.regex_validation(value, { regex: this.regex_password })) {
        
        this.setState({ pass_verify: true});
        
        if (value === this.state.password_retype && !this.is_empty(this.state.password_retype)) {
          this.setState({ pass_retype_verify: true});
        }
        else {
          this.setState({ pass_retype_verify: false });
        }
      }
      else {
        this.setState(
          { pass_verify: false, 
            pass_retype_verify: false }
        );
      }
    }

    else if (field == "password_retype") {
      //console.log(value, this.state.form_inputs);
      if (this.password_match(value, this.state.form_inputs)) {
        this.setState({ pass_retype_verify: true });
      }
      else {
        this.setState({ pass_retype_verify: false });
      }
    }

  }


  handle_change = (e) => {
    let new_form = Object.assign({}, this.state.form_inputs);
    new_form[e.target.name] = e.target.value;
    this.setState({ form_inputs: new_form });
    this.verifiy(e.target.name, e.target.value);
  }


  submit_handler = (e) => {
    e.preventDefault();
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
      </form>
    );
  }
}

export default Register;