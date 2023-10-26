export const validateRegistrationUser = ({email, password, userName}: any) => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@_]{8,}$/;
  const usernameRegex = /^[A-Za-z0-9_]{3,40}/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);
  const isUsernameValid = usernameRegex.test(userName);

  const errors: {email: string; password: string; userName: string} = {
    email: '',
    password: '',
    userName: '',
  };

  if (!isEmailValid) {
    errors.email = 'Invalid email address';
  }

  if (!isPasswordValid) {
    errors.password =
      'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit.';
  }

  if (!isUsernameValid) {
    errors.userName =
      'Username must contain only letters, numbers, and underscores and be between 3 and 20 characters long.';
  }

  return {
    isValid: isEmailValid && isPasswordValid && isUsernameValid,
    errors,
  };
};

// Output: { isValid: true, errors: {} }

export const validateLoginUser = ({email, password}: any) => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@_]{8,}$/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);

  const errors: {email: string; password: string; userName: string} = {
    email: '',
    password: '',
    userName: '',
  };

  if (!isEmailValid) {
    errors.email = 'Invalid email address';
  }

  if (!isPasswordValid) {
    errors.password =
      'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit.';
  }

  return {
    isValid: isEmailValid && isPasswordValid,
    errors,
  };
};

// Output: { isValid: true, errors: {} }
