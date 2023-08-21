const Log = require("../models").Log;

const logController = {
  getAllLogs: async (req, res) => {
    console.log("i am here");
    try {
      // Fetch all logs from the database
      const logs = await Log.findAll();

      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },
};

module.exports = logController;
