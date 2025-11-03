import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

export class usercreater {
    static async creater(username, email) {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        try {
            await client.connect();
            const db = client.db("Product");
            const collection = db.collection("user_data");
            const existingUser = await collection.findOne({
                $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
            });
            if (existingUser) {
                return false
            }
            else {
                await collection.insertOne({
                    username: username,
                    email: email,
                    tracked_product: []
                });
                return true
            }
        } catch (error) {
            throw new Error("while createing user there is error ");
        }
    }
}
