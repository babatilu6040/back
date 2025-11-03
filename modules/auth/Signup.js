import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { PasswordHasher } from "../../utils/PasswordHasher.js";
import { TokenGenrater, TokenVerifier } from "../../utils/JwtToken.js";
import { usercreater } from "../../utils/UserCreater.js";
import { IDGenerator } from "../../utils/IDGenerator.js";

export default async function Signup(firstname, lastname, email, password) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    if (!firstname || !lastname || !email || !password) {
      return {
        status: "fail",
        message: "All fields are required for signup",
      };
    }

    const username = `${
      firstname.trim().charAt(0).toUpperCase() +
      firstname.trim().slice(1).toLowerCase()
    }${
      lastname.trim().charAt(0).toUpperCase() +
      lastname.trim().slice(1).toLowerCase()
    }`;

    await client.connect();
    const db = client.db("user");
    const collection = db.collection("credentials");

    const existingEmail = await collection.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return {
        status: "error",
        message: "Email already exists.",
        details: "Please use a different email address.",
      };
    }

    const existingUsername = await collection.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      return {
        status: "error",
        message: "Username already taken!",
        details: "Please choose a different username.",
      };
    }

    try {
      let productStatus;
      const userCreated = await usercreater.creater(username, email);
      if (!userCreated) {
        productStatus = "already created";
      } else {
        productStatus = "success";
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    try {
      const hashpassword = await PasswordHasher.hash(password);
      const accesstoken = TokenGenrater.accesstoken(email.toLowerCase());
      const refreshtoken = TokenGenrater.refreshtoken(email.toLowerCase());
      const uid = IDGenerator.generateUID(firstname, lastname, email);
      const access_id = IDGenerator.generateAccessID(uid, username, email);
      const user_data = {
        uid: uid,
        access_id: access_id,
        firstname:
          firstname.trim().charAt(0).toUpperCase() +
          firstname.trim().slice(1).toLowerCase(),
        lastname:
          lastname.trim().charAt(0).toUpperCase() +
          lastname.trim().slice(1).toLowerCase(),
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashpassword,
      };
      await collection.insertOne(user_data);

      const user = {
        status: "success",
        message: "Signup successful!",
        refresh_token: accesstoken,
        access_token: refreshtoken,
        uid: uid,
        access_id: access_id,
        firstname:
          firstname.trim().charAt(0).toUpperCase() +
          firstname.trim().slice(1).toLowerCase(),
        lastname:
          lastname.trim().charAt(0).toUpperCase() +
          lastname.trim().slice(1).toLowerCase(),
        email: email.toLowerCase(),
        username: username.toLowerCase(),
      };

      return user;
    } catch (error) {
        console.log(error)
      return {
        status: "error",
        massage: error.massage,
      };
    }
  } catch (error) {
    return {
      status: "error",
      massage: "server error",
    };
  } finally {
    await client.close();
  }
}
