export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\d!#$%&*.?@A-Za-z]{8,}$/u

export const isValidPassword = (input: string) => new RegExp(passwordRegex).test(input)

const emailRegex = /^[^@]+@[^@][^.@]*\.[^@]+$/u

export const isValidEmail = (input: string) => new RegExp(emailRegex).test(input)

export const mustMatch = (input1: string, input2: string) => input1 === input2

export type InputValidationError = 'email' | 'maximumChars' | 'mustMatch' | 'password' | 'required'

const urlRegex =
  // eslint-disable-next-line regexp/no-unused-capturing-group -- Could be useful in the future
  /^https?:\/\/(w{3}\.)?[\w#%+\-.:=@~]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+\-./:=?@~]*)$/u

export const isValidUrl = (input: string) => new RegExp(urlRegex).test(input)

const phoneRegex = /^\+?\d{1,3}[ (\-.]?\d{3}[ )\-.]?\d{3}[ \-.]?\d{4}$/u

export const isValidPhone = (input: string) => new RegExp(phoneRegex).test(input)
