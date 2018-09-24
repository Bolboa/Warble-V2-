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
        const validation_method = rule.method;
        const args = rule.args || undefined;
        if (validation_method(field_value, args, state) !== rule.valid_when) {
          validation[rule.field] = { is_invalid: true, message: rule.message }
          validation.is_valid = false;
        }
      }
    });
    return validation;
  }
}

export default FormValidator;