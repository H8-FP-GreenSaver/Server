const request = require("supertest");
const app = require("../app");
const { sequelize, User, Plant, User_Plants } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

let access_token;

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
};

const user5 = {
  email: "user2@user.com",
  password: "user2",
};

const user6 = {
  fullName: "",
  email: "user6@user.com",
  password: "user6",
};

const user7 = {
  fullName: "user7",
  email: "",
  password: "user7",
};

const user8 = {
  fullName: "user8",
  email: "user8@user",
  password: "user8",
};

const user9 = {
  fullName: "user9",
  email: "user9@user.com",
  password: "",
};

const user10 = {
  fullName: "user10",
  email: "user10@user.com",
  password: "user",
};

const user11 = {
  fullName: "user11",
  email: "user11@user.com",
  password: "user11",
};

const dummy = {
  userId: 1,
};

const dummyUserPreferences = {
  categoryIds: [1, 2, 3],
};

const dummyExpo = {
  expo_token: "ExponentPushToken[asdasdasdasd]",
};

describe("Users", () => {
  describe("POST /users/login", () => {
    describe("Success", () => {
      test("Berhasil login dan mengirimkan access_token", async () => {
        let { body, status } = await request(app)
          .post("/users/login")
          .send(user1);

        expect(status).toBe(200);
        expect(body).toHaveProperty("access_token", expect.any(String));
      });
    });
    describe("Failed", () => {
      test("Email tidak diberikan / tidak diinput", async () => {
        let { body, status } = await request(app)
          .post("/users/login")
          .send(user2);

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Email / Password is required");
      }),
        test("Password tidak diberikan / tidak diinput", async () => {
          let { body, status } = await request(app)
            .post("/users/login")
            .send(user3);

          expect(status).toBe(400);
          expect(body).toHaveProperty(
            "message",
            "Email / Password is required"
          );
        }),
        test("Email diberikan invalid / tidak terdaftar", async () => {
          let { body, status } = await request(app)
            .post("/users/login")
            .send(user4);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Email / Password");
        }),
        test("Password diberikan salah / tidak match", async () => {
          let { body, status } = await request(app)
            .post("/users/login")
            .send(user5);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Email / Password");
        });
    });
  });
  describe("POST /users/register", () => {
    describe("Success", () => {
      test("Berhasil register dan mengirimkan data user", async () => {
        let { body, status } = await request(app)
          .post("/users/register")
          .send(user11);

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
      });
    });
    describe("Failed", () => {
      test("Name tidak diberikan / tidak diinput", async () => {
        let { body, status } = await request(app)
          .post("/users/register")
          .send(user6);

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Name is Required");
      }),
        test("Email tidak diberikan / tidak diinput", async () => {
          let { body, status } = await request(app)
            .post("/users/register")
            .send(user7);

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is Required");
        }),
        test("Email yang diberikan invalid", async () => {
          let { body, status } = await request(app)
            .post("/users/register")
            .send(user8);

          expect(status).toBe(400);
          expect(body).toHaveProperty(
            "message",
            "Email is not right formatted"
          );
        }),
        test("Password tidak diberikan / tidak diinput", async () => {
          let { body, status } = await request(app)
            .post("/users/register")
            .send(user9);

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required");
        }),
        test("Minimal panjang Password 5 huruf", async () => {
          let { body, status } = await request(app)
            .post("/users/register")
            .send(user10);

          expect(status).toBe(400);
          expect(body).toHaveProperty(
            "message",
            "Minimum password length is 5"
          );
        });
    });
  });
  describe("GET /users/home", () => {
    describe("Success", () => {
      test("Berhasil memuat semua entitas user plants", async () => {
        let { body, status } = await request(app)
          .get("/users/home")
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(body).toHaveProperty("5");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).get("/users/home");

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .get("/users/home")
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("POST /users/expo-token", () => {
    describe("Success", () => {
      test("Berhasil mengirimkan expo_token", async () => {
        let { body, status } = await request(app)
          .post("/users/expo-token")
          .set("Authorization", "Bearer " + access_token)
          .send(dummyExpo);

        expect(status).toBe(201);
        expect(body).toHaveProperty("message", "Expo Token Created");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app)
          .post("/users/expo-token")
          .send(dummyExpo);

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .post("/users/expo-token")
            .set("Authorization", access_token)
            .send(dummyExpo);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("POST /users/add-plant/:plantId", () => {
    describe("Success", () => {
      test("Berhasil menambahkan entitas user plant", async () => {
        const plant = await Plant.findOne();
        let { body, status } = await request(app)
          .post(`/users/add-plant/${plant.id}`)
          .set("Authorization", "Bearer " + access_token)
          .send(dummy);

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).post(
          "/users/add-plant/:plantId"
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .post("/users/add-plant/:plantId")
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("POST /users/user-preferences/add", () => {
    describe("Success", () => {
      test("Berhasil membuat entitas user preferences baru", async () => {
        let { body, status } = await request(app)
          .post(`/users/user-preferences/add`)
          .set("Authorization", "Bearer " + access_token)
          .send(dummyUserPreferences);

        expect(status).toBe(201);
        expect(Array.isArray(body)).toBeTruthy();
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).post(
          `/users/user-preferences/add`
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .post(`/users/user-preferences/add`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("GET /users/user-preferences", () => {
    describe("Success", () => {
      test("Berhasil memuat entitas user preferences", async () => {
        let { body, status } = await request(app)
          .get(`/users/user-preferences`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).get(
          `/users/user-preferences`
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .get(`/users/user-preferences`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("GET /users/user-profile", () => {
    describe("Success", () => {
      test("Berhasil memuat entitas user profile", async () => {
        let { body, status } = await request(app)
          .get(`/users/user-profile`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(body).toHaveProperty("id");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).get(`/users/user-profile`);

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .get(`/users/user-profile`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("PATCH /users/user-profile/update-skill", () => {
    describe("Success", () => {
      test("Berhasil mengupdate profile dari user", async () => {
        let { body, status } = await request(app)
          .patch(`/users/user-profile/update-skill`)
          .set("Authorization", "Bearer " + access_token)
          .send({
            skill: "Ahli",
          });

        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "User skill is updated");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).patch(
          `/users/user-profile/update-skill`
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .patch(`/users/user-profile/update-skill`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("PUT /users/user-profile/edit-profile", () => {
    describe("Success", () => {
      test("Berhasil mengupdate skill dari user", async () => {
        let { body, status } = await request(app)
          .put(`/users/user-profile/edit-profile`)
          .set("Authorization", "Bearer " + access_token)
          .send({
            fullName: "detadeta",
            skill: "Ahli",
            avatar: "http://",
          });

        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "User profile is updated");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).put(
          `/users/user-profile/edit-profile`
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .put(`/users/user-profile/edit-profile`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("GET /users/plant-detail/:id", () => {
    describe("Success", () => {
      test("Berhasil memuat entitas tanaman yang ditanam user", async () => {
        const userPlant = await User_Plants.findOne();
        let { body, status } = await request(app)
          .get(`/users/plant-detail/${userPlant.plantId}`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(body).toHaveProperty("id");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).get(
          `/users/plant-detail/:id`
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .get(`/users/plant-detail/:id`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
    });
  });
  describe("DELETE /users/plant-detail/:id", () => {
    describe("Success", () => {
      test("Berhasil memuat entitas tanaman yang ditanam user", async () => {
        const userPlant = await User_Plants.findOne();
        let { body, status } = await request(app)
          .delete(`/users/plant-detail/${userPlant.plantId}`)
          .set("Authorization", "Bearer " + access_token);

        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "Successfully deleted!");
      });
    });
    describe("Failed", () => {
      test("Gagal menjalankan fitur karena belum login", async () => {
        let { body, status } = await request(app).delete(
          `/users/plant-detail/:id`
        );

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
      }),
        test("Gagal memuat entitas dikarenakan token tidak valid", async () => {
          let { body, status } = await request(app)
            .delete(`/users/plant-detail/:id`)
            .set("Authorization", access_token);

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Unauthenticated");
        });
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

  await queryInterface.bulkInsert("User_Plants", [
    {
      userId: 1,
      plantId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterAll(async () => {
  await queryInterface.bulkDelete("User_Preferences", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
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
  await queryInterface.bulkDelete("User_Plants", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
