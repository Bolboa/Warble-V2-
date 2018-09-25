/*
Regex for verifying an email.
Regex for verifying a password:
  - must be at least 6 characters
  - must contain a capital letter
  - must contain a number
  - must contain a special character
*/
export const regex_options = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!@$%^&*\-_]).{6,}$/
};


/*
Check if an item is empty.
*/
export const is_empty = (confirmation) => (confirmation.length == 0);


/*
Check if the length of an item is greater than a specified size.
*/
export const size_check = (confirmation, context) => (confirmation.length < (context.size || 1));


/*
Check field against some specified regex.
The `cs` parameter checks if the field is case sensitive or not.
*/
export const regex_validation = (confirmation, context) => {
  if (context.cs == false) return regex_options[context.regex].test(String(confirmation).toLowerCase());
  else return regex_options[context.regex].test(String(confirmation));
};


/*
Check if field matches the password in the state.
*/
export const password_match = (confirmation, state) => (confirmation === state.password);