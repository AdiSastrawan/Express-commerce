import yup from "yup"
export const validationRegister = yup.object({
  username: yup.string().required().min(4).max(40),
  email: yup.string().required().email(),
  password: yup.string().required().min(8).max(20),
})
