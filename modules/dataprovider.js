import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

export default async function DataProvider(AccessId, Username) {

    const uri = process.env.MONGO_URI;
    const dbName = "Product";
    const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

    try {

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user_data");

        if (!AccessId) {
            return { status: "fail", message: "accessid are require" };
        }
        if (!Username) {
            return { status: "fail", message: "username are require" };
        }

        
        const result = await collection.findOne({ accessid: AccessId });

        if (!result) {
            return { status: "fail", message: "user not found!" };
        } 

        const storedUsername = (result.username || "").toLowerCase().trim();
        const inputUsername = Username.toLowerCase().trim();

        if (storedUsername === inputUsername) {
            return {
                status: "success",
                message: "user found successfully!",
                data: result,
            };
        } else {
            return {
                status: "fail",
                message: "username does not match the accessid!",
            };
        }

    }
    catch (error) {
        return { status: "fail", message: "Error updating product", error: error.message };
    }
    finally {
        await client.close();
    }
}
