const getErrDescriptions = (err) => {
  const { errors } = err;

  const errDescriptions = Object.keys(errors).map((errKey) => {
    const { properties: { message } } = errors[errKey];
    return message
      .split('')
      .map((char) => char === '`' ? '"' : char)
      .join('');
  });
  return errDescriptions;
};

exports.getErrDescriptions = getErrDescriptions;
