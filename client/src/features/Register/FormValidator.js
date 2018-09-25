import * as DefaultValidations from "./DefaultValidations";


class FormValidator {

  constructor(validations) {
    this.validations = validations;
  }

  valid() {
    const validation = {};
    this.validations.map(rule => (
      validation[rule.field] = { is_invalid: false, message: "" }
    ));

    return { is_valid: true, ...validation };
  }

  validate(state) {
    let validation = this.valid();
    this.validations.forEach(rule => {
      if (!validation[rule.field].is_invalid) {
        const field_value = state[String(rule.field)].toString();
        const validation_method = typeof rule.method === "string" ? DefaultValidations[rule.method] : rule.method;
        const args = rule.args || undefined;

        let params;
        args != undefined ? params = [field_value, args, state] : params = [field_value, state];
        
        if (validation_method(...params) !== rule.valid_when) {
          validation[rule.field] = { is_invalid: true, message: rule.message }
          validation.is_valid = false;
        }
      }
    });
    return validation;
  }
}

export default FormValidator;