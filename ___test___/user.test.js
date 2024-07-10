const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");
const { queryInterface } = sequelize;

const user1 = {
  email: "admin@admin.com",
  password: "admin",
};

const user2 = {
  email: "",
  password: "user",
};

const user3 = {
    email: "user@user.com",
    password: "",
  };

const user4 = {
    email: "user1@user.com",
    password: "user1",
}

const user5 = {
    email: "user2@user.com",
    password: "user2"
}

const user6 = {
    fullName: "",
    email: "user6@user.com",
    password: "user6"
}

const user7 = {
    fullName: "user7",
    email: "",
    password: "user7"
}

const user8 = {
    fullName: "user8",
    email: "user8@user",
    password: "user8"
}

const user9 = {
    fullName: "user9",
    email: "user9@user.com",
    password: ""
}

const user10 = {
    fullName: "user10",
    email: "user10@user.com",
    password: "user"
}

const user11 = {
    fullName: "user11",
    email: "user11@user.com",
    password: "user11"
}

describe("Users", () => {
  describe("POST /users/login", () => {
    describe("Success",() => {
      
      test("Berhasil login dan mengirimkan access_token", async () => {
        let { body, status } = await request(app).post("/users/login").send(user1);

        expect(status).toBe(200);
        expect(body).toHaveProperty("access_token", expect.any(String));
      });
    })
    describe("Failed", () => {
      test("Email tidak diberikan / tidak diinput", async () => {
        let {body, status} = await request(app).post("/users/login").send(user2)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Email / Password is required")
    }),
    test("Password tidak diberikan / tidak diinput", async () => {
        let {body, status} = await request(app).post("/users/login").send(user3)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Email / Password is required")
    }),
    test("Email diberikan invalid / tidak terdaftar", async () => {
        let {body, status} = await request(app).post("/users/login").send(user4)

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Email / Password")
    }),
    test("Password diberikan salah / tidak match", async () => {
        let {body, status} = await request(app).post("/users/login").send(user5)

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Email / Password")
    })
    });
  }),
  describe("POST /users/register", () => {
    describe("Success",() => {
      
      test("Berhasil register dan mengirimkan data user", async () => {
        let { body, status } = await request(app).post("/users/register").send(user11);

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
      });
    })
    describe("Failed", () => {
      test("Name tidak diberikan / tidak diinput", async () => {
        let {body, status} = await request(app).post("/users/register").send(user6)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Name is Required")
    }),
    test("Email tidak diberikan / tidak diinput", async () => {
        let {body, status} = await request(app).post("/users/register").send(user7)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Email is Required")
    }),
    test("Email yang diberikan invalid", async () => {
        let {body, status} = await request(app).post("/users/register").send(user8)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Email is not right formatted")
    }),
    test("Password tidak diberikan / tidak diinput", async () => {
        let {body, status} = await request(app).post("/users/register").send(user9)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Password is required")
    }),
    test("Minimal panjang Password 5 huruf", async () => {
        let {body, status} = await request(app).post("/users/register").send(user10)

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Minimum password length is 5")
    })
    });
  });
});

beforeAll(async () => {
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        email: user1.email,
        password: hashPassword(user1.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: user2.email,
        password: hashPassword(user2.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: user3.email,
        password: hashPassword(user3.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: user5.email,
        password: user5.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
