import * as DefaultValidations from "./DefaultValidations";


/*
Validate the inputs of a form.
*/
class FormValidator {

  constructor(validations) {
    
    // Validation rules and details.
    this.validations = validations;

    // Results.
    this.results = "";

  }


  /*
  Get all form input values save the ones that the user opts out of.
  */
  get_values = (exclude) => {

    let result = {};
    
    // Values that will not be included.
    exclude = [...exclude, "is_valid"];

    // Extract all of the input values.
    Object.entries(this.results)
      .forEach((key, val) => 
        (!exclude.includes(key[0]) ? result[key[0]] = key[1].field : undefined ));
    
    return result;
    
  }


  /*
  Assume form is valid.
  */
  valid = () => {

    // Holds the default details of the fields of the form.
    const validation = {};

    // Fields are valid by default.
    this.validations.map(rule => (
      validation[rule.field] = { is_invalid: false, message: "", field: "" }
    ));
    
    // Assume it is valid.
    return { is_valid: true, ...validation };
  }


  /*
  Validate the form and its fields.
  */
  validate = (state) => {

    // Assume the form is valid and all fields are valid.
    let validation = this.valid();

    // Loop through each validation rule.
    this.validations.forEach(rule => {

      // If a field is still valid,
      // check to see if it fails on the condition.
      if (!validation[rule.field].is_invalid) {

        // The value of the field.
        const field_value = state[String(rule.field)].toString();

        // Function to be used to validate the field.
        const validation_method = typeof rule.method === "string" ? DefaultValidations[rule.method] : rule.method;
        
        // Optional parameters to be passed to the validation function.
        const args = rule.args || undefined;

        // The parameters to be passed to the validation function.
        let params;
        args != undefined ? params = [field_value, args, state] : params = [field_value, state];
        
        // If the field is not valid,
        // change the status of the form and the field as well.
        if (validation_method(...params) !== rule.valid_when) {
          validation[rule.field] = { is_invalid: true, message: rule.message, field: "" };
          validation.is_valid = false;
        }
        else {
          validation[rule.field].field = field_value;
        }
      }
    });

    // Save the results.
    this.results = validation;

    return validation;

  }
}


export default FormValidator;