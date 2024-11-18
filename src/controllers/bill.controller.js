import { CACHE_TIMEOUT } from "../constants.js";
import billModel from "../models/billModel.js";
import insuranceModel from "../models/insuranceModel.js";
import patientModel from "../models/patientModel.js";
import { client } from "../redis.js";

export const createBill = async (req, res) => {
  try {
    const {
      billNumber,
      description,
      paymentType,
      billDate: date,
      billTime: time,
      amount,
      discount,
      tax,
      totalAmount,
      insuranceCompany,
      insurancePlan,
      claimAmount,
      claimedAmount,
      doctorId,
      doctorName,
      phone,
      patientId,
      gender,
      age,
      diseaseName,
      address,
    } = req.body;
    // //find the patient id based on the phone
    // const patient = await patientModel.findOne({ _id:patientId });

    if (insuranceCompany && insurancePlan && claimAmount && claimedAmount) {
      const newInsurance = new insuranceModel({
        patientId,
        insuranceCompany,
        insurancePlan,
        claimAmount,
        claimedAmount,
      });
      await newInsurance.save();
      req.body.insuranceId = newInsurance._id;
    }
    // if (!billNumber || !description || !paymentType || !date || !time || !amount || !discount || !tax || !totalAmount) {
    //     return res.status(400).json({ message: "All fields are required" });
    //   }

    const newBill = new billModel({
      billNumber,
      phone,
      gender,
      age,
      patientId,
      doctorId,
      insuranceId: req.body.insuranceId,
      diseaseName,
      description,
      paymentType,
      date,
      time,
      amount,
      discount,
      tax,
      totalAmount,
      address,
    });
    await client.del(`/bill/getbill`);
    await client.del(`/bill/getbillsById`);
    await client.del(`/bill/getInsuranceBills`);

    await newBill.save();
    res.status(201).json({
      success: true,
      data: newBill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create the bill",
      error: error.message,
    });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await billModel
      .find()
      .populate("patientId doctorId insuranceId");
      const key = req.originalUrl;
      await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: bills }));
    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};

//get bills by patientID
export const getbillsByPatientId = async (req, res) => {
  try {
    const Id = req.user.id;

    const bills = await billModel
      .find({ patientId: Id })
      .populate("patientId doctorId insuranceId");
      const key = req.originalUrl;
      await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: bills }));
    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};

//get insurance bills
export const getInsuranceBills = async (req, res) => {
  try {
    const bills = await billModel.find({ paymentType: "Insurance" });
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: bills }));
    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error.message,
    });
  }
};

// Get a single bill by ID
export const getBillById = async (req, res) => {
  try {
    const bill = await billModel
      .findById(req.params.id)
      .populate("patientId doctorId insuranceId");
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    const key = req.originalUrl;
    await client.setEx(key, CACHE_TIMEOUT, JSON.stringify({ data: bill }));
    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch the bill",
      error: error.message,
    });
  }
};
export const updateBill = async (req, res) => {
  try {
    if (req.body.totalAmount && isNaN(Number(req.body.totalAmount))) {
      return res.status(400).json({
        success: false,
        message: "Invalid totalAmount value",
      });
    }

    const updatedBill = await billModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    await client.del(`/bill/getbill`);
    await client.del(`/bill/getbillsById`);
    await client.del(`/bill/getInsuranceBills`);
    await client.del(`/bill/singlebill/${req.params.id}`);

    res.status(200).json({
      success: true,
      data: updatedBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bill not found",
    });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const bill = await billModel.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }
    await client.del(`/bill/getbill`);
    await client.del(`/bill/getbillsById`);
    await client.del(`/bill/getInsuranceBills`);
    await client.del(`/bill/singlebill/${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the bill",
      error: error.message,
    });
  }
};
