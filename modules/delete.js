import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

export default async function Delete(AccessId, ProductID) {
    const uri = process.env.MONGO_URI;
    const dbName = "Product";

    const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user_data");
        try {

            if (!AccessId || !ProductID) {
                return { status: "error", message: "both are rquire" };
            }

            const user = await collection.findOne({ accessid: AccessId });

            if (!user) {
                return { status: "error", message: "User not found" };
            }

            const productExists = user.tracked_product.some(p => p.Product_id === ProductID);
            if (!productExists) {
                return {
                    status: "error",
                    message: "ProductID not found in tracked products",
                };
            }

            const result = await collection.updateOne(
                { accessid: AccessId },
                { $pull: { tracked_product: { Product_id: ProductID } } }
            );

            if (result.modifiedCount > 0) {
                return {
                    status: "success",
                    message: "product delete successfully !"
                }
            } else {
                return { status: "fail", message: "No changes made" }
            }


        }
        catch (error) {
            return { status: "fail", message: "Error updating product", };
        }

    }
    catch (error) {
        return { status: "fail", message: "Error updating product" };
    }
    finally {
        await client.close();
    }
}
