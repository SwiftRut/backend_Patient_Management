import hospitalModel from "../models/hospitalModel.js";
import { client } from "../redis.js";
import { CACHE_TIMEOUT } from "../constants.js";

export const createHospital = async (req, res) => {
  try {
    const { name, address, country, state, city, zipcode } = req.body;
    if (!name || !address || !country || !state || !city || !zipcode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newHospital = new hospitalModel({
      name,
      address,
      country,
      state,
      city,
      zipcode,
    });

    await newHospital.save();
    //remove the old cache data
    await client.del("/hospital/get-all-hospitals");

    res.status(201).json({
      message: "Hospital created successfully",
      hospital: newHospital,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalModel.find();
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: hospitals }));
    res.status(200).json({
      message: "Hospitals fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
