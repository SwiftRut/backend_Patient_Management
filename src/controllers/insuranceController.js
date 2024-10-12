import insuranceModel from "../models/insuranceModel.js"

export const createInsurance = async (req, res) => {
    try {
      const insurance = await insuranceModel(req.body);
      await insurance.save();
      res.status(201).json({
        success: true,
        data: insurance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create insurance record',
        error: error.message,
      });
    }
}

export const getInsurances = async (req, res) => {
    try {
      const insurances = await insuranceModel.find()
        .populate('bill')
        .populate('doctor')
        .populate('patient');
      res.status(200).json({
        success: true,
        data: insurances,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch insurance records',
        error: error.message,
      });
    }
  };


  export const getInsuranceById = async (req, res) => {
    try {
      const insurance = await insuranceModel.findById(req.params.id)
        .populate('bill')
        .populate('doctor')
        .populate('patient');
      
      if (!insurance) {
        return res.status(404).json({
          success: false,
          message: 'Insurance record not found',
        });
      }
      
      res.status(200).json({
        success: true,
        data: insurance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch the insurance record',
        error: error.message,
      });
    }
  };

  export const updateInsurance = async (req, res) => {
    try {
      const updatedInsurance = await insuranceModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedInsurance) {
        return res.status(404).json({
          success: false,
          message: 'Insurance record not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: updatedInsurance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update insurance record',
        error: error.message,
      });
    }
  };

  export const deleteInsurance = async (req, res) => {
    try {
      const insurance = await insuranceModel.findByIdAndDelete(req.params.id);
  
      if (!insurance) {
        return res.status(404).json({
          success: false,
          message: 'Insurance record not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Insurance record deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete insurance record',
        error: error.message,
      });
    }
  };