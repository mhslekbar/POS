const ConsumptionModel = require("../models/ConsumptionModel");
const { getLatestDayOfMonth } = require("../functions/functions");

const getConsumptions = async (req, res) => {
  try {
    const { filterDay, day, month, year } = req.query;
    let consumptions,
      queryFound = false;

    if (filterDay && !queryFound) {
      let queryFilter = "";
      if (day && month && year) {
        queryFilter = {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, year] },
              { $eq: [{ $month: "$createdAt" }, month] },
              { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
            ],
          },
        };
        queryFound = true;
      } else {
        if (year) {
          queryFound = true;
        }
        let monthStart = month;
        let monthEnd = month;
        if (month === "") {
          monthStart = 1;
          monthEnd = 12;
        }
        let dayStart = day;
        let dayEnd = day;
        if (day === "") {
          dayStart = 1;
          dayEnd = getLatestDayOfMonth(year, monthEnd);
        }

        let startDate = new Date(year + "-" + monthStart + "-" + dayStart);
        let endDate = new Date(year + "-" + monthEnd + "-" + dayEnd);
        endDate.setHours("23", "59");
        queryFilter = { createdAt: { $gte: startDate, $lte: endDate } };
      }

      if (queryFound) {
        consumptions = await ConsumptionModel.find(queryFilter).sort({
          createdAt: -1,
        });
      }
    }

    if (!queryFound) {
      consumptions = await ConsumptionModel.find().sort({ createdAt: -1 });
    }

    res.status(200).json({ success: consumptions });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const addConsumption = async (req, res) => {
  try {
    const { note, amount } = req.body;
    const formErrors = [];
    if (isNaN(amount)) {
      formErrors.push("le montant doit etre numeric");
    }
    if (amount.length === 0) {
      formErrors.push("le montant est obligatoire");
    }
    if (formErrors.length === 0) {
      await ConsumptionModel.create({ note, amount });
      await getConsumptions(req, res);
    } else {
      res.status(300).json({ formErrors });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const editConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, amount } = req.body;
    const formErrors = [];
    if (isNaN(amount)) {
      formErrors.push("le montant doit etre numeric");
    }
    if (amount.length === 0) {
      formErrors.push("le montant est obligatoire");
    }
    if (formErrors.length === 0) {
      await ConsumptionModel.updateOne(
        { _id: id },
        { note, amount },
        { new: true }
      );
      await getConsumptions(req, res);
    } else {
      res.status(300).json({ formErrors });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deleteConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    await ConsumptionModel.deleteOne({ _id: id });
    await getConsumptions(req, res);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = {
  getConsumptions,
  addConsumption,
  editConsumption,
  deleteConsumption,
};
