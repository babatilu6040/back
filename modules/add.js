import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

export default async function Add(AccessId, URL) {
    const uri = process.env.MONGO_URI;
    const dbName = "Product";
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    try {
        const response = await fetch("http://localhost:7000/api/search/result", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessid: AccessId, url: URL })
        });

        try {
            const result = await response.json();
            const NewProductData = result.product;
            const productIdToFind = NewProductData.Product_id;
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection("user_data");

            const user = await collection.findOne({ accessid: AccessId });

            if (!user) {
                return { message: "User not found", status: "error" };
            }

            const existingProduct = await collection.findOne({
                accessid: AccessId,
                "tracked_product.Product_id": NewProductData.Product_id
            });

            if (existingProduct) {
                return { message: "Product already exists", status: "error" };
            }
            else {
                await collection.updateOne(
                    { accessid: AccessId },
                    { $push: { tracked_product: NewProductData } }
                );
                if (result.status == "success") {
                    const product = result.product;
                    return { product: product, status: result.status };
                }
            }
        }
        catch (error) {
            return { message: error, status: "error" };
        }

    }
    catch (error) {

        return { message: error.message, status: "error" };
    }
    finally {
        await client.close();
    }
}
