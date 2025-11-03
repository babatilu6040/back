import { Collection, MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

export default async function Add(Accessid) {
    const uri = process.env.MONGO_URI;
    const dbName = "Product";
    const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

    try {

        const new_product_data = await fetch("URl");
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user_data");

        const user = await collection.findOne({ accessid:Accessid });

        console.log(user);
    }
    catch {

    }

    finally {
        await client.close();
    }
}

Add("P9HAL9XF8GIYD1NJGHOY")