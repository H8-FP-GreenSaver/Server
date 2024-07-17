const request = require("supertest");
const app = require("../app");
const { sequelize, User, Plant_Steps, Step} = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jwt");

const user1 = {
  fullName: "user1",
  email: "user1@gmail.com",
  password: "user1",
};

let access_token;

beforeAll(async () => {
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        fullName: user1.fullName,
        email: user1.email,
        password: hashPassword(user1.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );

  let user = await User.findOne({ where: { email: user1.email } });
  access_token = signToken({ id: user.id });

  await queryInterface.bulkInsert(
    "Steps",
    require("../db/steps.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })
  );

});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("Steps", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Steps", () => {
  describe("GET /steps/:id", () => {
    describe("Success", () => {
      test("Berhasil memuat entitas step berdasarkan id", async () => {
        let step = await Step.findOne()
        let { body, status } = await request(app)
          .get(`/steps/${step.id}`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).get(`/plants`);

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      });
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .get(`/plants`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
        test("Gagal error 500", async () => {
          jest.spyOn(Plant_Steps, "findAll").mockRejectedValue("Internal Server Error");
  
          let { body, status } = await request(app)
            .get(`/steps/:id`)
            .set("Authorization", "Bearer " + access_token);
  
          expect(status).toBe(500);
          expect(body).toHaveProperty("message", "Internal Server Error");
        });
    });
  });
});
