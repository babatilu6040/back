import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

export default async function Update(AccessId, product) {
    const uri = process.env.MONGO_URI;
    const dbName = "Product";

    const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user_data");

        console.log("🆔 Product ID:", AccessId);
        console.log("🛒 New Product Values:", product);

        try {
            const user = await collection.findOne({ accessid: AccessId });
            
        }
        catch (error) {
            return { success: "fail", message: "Error updating product", };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("⚠️ Error updating product:", error);
        return { success: fail, message: "Error updating product" };
    } finally {
        await client.close();
    }
}
