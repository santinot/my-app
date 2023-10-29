function isEmail(string) {
  const re =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return re.test(string);
}

export function validationEmail(value) {
  return value && !isEmail(value.trim()) ? false : true;
}

export function validationName(value, list) {
  let bool = false
  list.map((contact) => {
    if ((contact.label).toLowerCase() === value.toLowerCase()) {
      bool = true;
    }
  });
  return (bool);
}