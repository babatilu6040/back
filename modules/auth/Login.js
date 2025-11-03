import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { PasswordHasher } from "../../utils/PasswordHasher.js";
import { TokenGenrater, TokenVerifier } from "../../utils/JwtToken.js";

export default async function Login(email, password, AccessToken, RefreshToken) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });


    try {
        if (!email || !password) {
            return {
                success: "fail",
                message: "email and password both are require"
            }
        }
      

        email = email.trim().toLowerCase();

        try {
            await client.connect();
            const db = client.db("user");
            const collection = db.collection("credentials");

            const users = await collection.findOne({ email: email });

            if (!users) {
                return {
                    status: "fail",
                    message: "user not found"
                }
            }

            const hashedPassword = users.password;
            const valid = await PasswordHasher.compare(password, hashedPassword);
            if (!valid) return { message: "Invalid credentials!", status: "fail", };



        }
        catch (error) {
            return {
                status: "error",
                message: error.message || "server error",
            }
        }

    }
    catch (error) {
        return {
            status: "error",
            message: "server error"
        }
    }
    finally {
        await client.close();
    }
}

