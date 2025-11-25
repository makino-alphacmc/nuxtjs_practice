// types/form-handling/p1/form.ts

export interface ContactForm {
  name: string
  email: string
  topic: 'bug' | 'question' | 'request'
  message: string
  agree: boolean
}

export interface FormValidationError {
  field: keyof ContactForm
  message: string
}

export interface SubmitResult {
  success: boolean
  timestamp: string
  payload?: ContactForm
}
