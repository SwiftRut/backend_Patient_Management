import billModel from "../models/billModel.js";

export const createBill = async (req, res) => {
  console.log("hangle the create a Bill")
    try {
        const {
            billNumber,
            patientId,
            description,
            paymentType,
            date,
            time,
            amount,
            discount,
            tax,
            totalAmount,
            insuranceId
        } = req.body
        console.log(req.body)
        // if (!billNumber || !description || !paymentType || !date || !time || !amount || !discount || !tax || !totalAmount) {
        //     return res.status(400).json({ message: "All fields are required" });
        //   }

        const newBill = new billModel(req.body)
        await newBill.save();
        res.status(201).json({
            success: true,
            data: newBill,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create the bill',
            error: error.message,
        });
    }

    const newBill = new billModel(req.body);
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
      console.log(req.body);
  
      if (req.body.totalAmount && isNaN(Number(req.body.totalAmount))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid totalAmount value',
        });
      }
  
      const updatedBill = await billModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedBill) {
        return res.status(404).json({
          success: false,
          message: 'Bill not found',
        });
      }
  
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
    res.status(200).json({
      success: true,
      data: updatedBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the bill",
      error: error.message,
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
