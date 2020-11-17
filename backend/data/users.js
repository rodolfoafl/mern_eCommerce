import bcrypt from "bcryptjs";

const user = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Rodolfo Leal",
    email: "rodolfo@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Barbara Leite",
    email: "barbara@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
