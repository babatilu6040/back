import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { TokenVerifier, TokenGenrater } from "../../utils/JwtToken.js";

export default async function Verify(AccessToken, RefreshToken, AccessId) {

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
        const db = client.db("user");
        const collection = db.collection("credentials");
        const users = await collection.findOne({ access_id: AccessId });

        if (!users) {
            return {
                status: "fail",
                message: "invaild Access ID!"
            };
        }

        const email = users.email;
        const AccessResult = TokenVerifier.VerifiyAccesstoken(AccessToken);
        const RefreshResult = TokenVerifier.VerifiyRefreshtoken(RefreshToken);

        if (AccessResult.valid) {
            console.log("✅ Access token is valid");
            return {
                status: "success",
                message: "Access token verified successfully."
            };
        } 
        else if (!AccessResult.valid && RefreshResult.valid) {
            const NewAccessToken = TokenGenrater.accesstoken(email);
            console.log("🔄 Access token expired, refresh token valid — issue new one");
            return {
                status: "success",
                message: "New access token should be generated.",
                Newaccesstoken: NewAccessToken
            };

        } 
        else {
            console.log("❌ Both tokens invalid");
            return {
                status: "fail",
                message: "Both tokens are invalid or expired."
            };
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