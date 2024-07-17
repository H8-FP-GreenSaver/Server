const request = require("supertest");
const app = require("../app");
const { sequelize, Plant, User } = require("../models");
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
    "Categories",
    require("../db/categories.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })
  );

  await queryInterface.bulkInsert(
    "Plants",
    require("../db/plants.json").map((el) => {
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
  await queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("Plants", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Plants", () => {
  describe("GET /plants", () => {
    describe("Success", () => {
      test("Berhasil memuat semua entitas plants", async () => {
        let { body, status } = await request(app)
          .get(`/plants`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
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
        jest.spyOn(Plant, "findAll").mockRejectedValue("Internal Server Error");

        let { body, status } = await request(app)
          .get(`/plants`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(500);
        expect(body).toHaveProperty("message", "Internal Server Error");
      });
    });
  });
  describe("GET /plants/:id", () => {
    describe("Success", () => {
      test("Berhasil memuat entitas plant berdasarkan id", async () => {
        const plant = await Plant.findOne();
        let { body, status } = await request(app)
          .get(`/plants/${plant.id}`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(body).toHaveProperty("id");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).get(`/plants/:id`);

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      });
      test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
        let { body, status } = await request(app)
          .get(`/plants/:id`)
          .set("Authorization", access_token);

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      });
      test("Gagal error 500", async () => {
        jest.spyOn(Plant, "findByPk").mockRejectedValue("Internal Server Error");

        let { body, status } = await request(app)
          .get(`/plants/:id`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(500);
        expect(body).toHaveProperty("message", "Internal Server Error");
      });
    });
  });
});
