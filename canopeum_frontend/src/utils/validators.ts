const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\d!#$%&*?@A-Za-z]{8,}$/u

export const isValidPassword = (input: string) => new RegExp(passwordRegex).test(input)

const emailRegex = /^[^@]+@[^@][^.@]*\.[^@]+$/u

export const isValidEmail = (input: string) => new RegExp(emailRegex).test(input)

export const mustMatch = (input1: string, input2: string) => input1 === input2

export type InputValidationError = 'email' | 'mustMatch' | 'password' | 'required'
