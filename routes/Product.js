import express from "express";
import Update from "../modules/update.js";
import Add from "../modules/add.js";
import Delete from "../modules/delete.js";
import DataProvider from "../modules/dataprovider.js"

const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { id, userid, product } = req.body;
    const result = await Update(userid, id, product);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { accessid, url } = req.body;
    const result = await Add(accessid, url);

    res.status(200).json({
      result
    });
  } catch (error) {
    res.status(500).json({ status: "false", message: "Server error" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { accessid, productid } = req.body;
    const result = await Delete(accessid, productid);

    res.status(200).json({
      result
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
});

router.post("/productprovider", async (req, res) => {
  try {
    const { accessid, username } = req.body;
    const result = await DataProvider(accessid, username);

    res.status(200).json({
      result
    });
  } catch (error) {
    res.status(500).json({ status: "false", message: "Server error", error: error.message || error });
  }
});

export default router;
