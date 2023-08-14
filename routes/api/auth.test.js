import mongoose from "mongoose";
import "dotenv/config";
import request from "supertest";

import { app } from "../../app.js";

const { DB_HOST_TEST, PORT } = process.env;

describe("test signup route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose
      .connect(DB_HOST_TEST)
      .then(console.log("Connection success"));
    server = app.listen(PORT);
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
  test("test signin correct data", async () => {
    const signinData = {
      email: "nikitasimakovua@gmail.com",
      password: "123456",
    };
    const {
      statusCode,
      body: { token, user },
    } = await request(app).post("/api/users/login").send(signinData);

    expect(statusCode).toBe(200);
    expect(token.length > 50).toBe(true);
    expect(typeof user).toBe("object");
    expect(typeof user.email || typeof user.subscription).toBe("string");
  });
  test("test signup with already register email", async () => {
    const signupData = {
      email: "nikitasimakovua@gmail.com",
      password: "123456",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/register")
      .send(signupData);

    expect(statusCode).toBe(409);
    expect(body.message).toBe("email already in use");
    // console.log(body.message);
    // expect(body.name).toBe(signupData.name);
    // expect(body.email).toBe(signupData.email);

    // const user = await User.findOne({ email: signupData.email });
    // expect(user.name).toBe(signupData.name);
  });
});
