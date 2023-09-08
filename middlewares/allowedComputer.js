const os = require("node:os")
const SettingModel = require("../models/SettingModel")

const networkInterfaces = os.networkInterfaces();

const checkComputer = async (req, res, next) => {
  try {
    let findMacAddress = ""
    if(os.platform() === "win32") {
      const macAddress = networkInterfaces['Ethernet'] || networkInterfaces['Wi-Fi'] || networkInterfaces['Wi-Fi 2'];
      if (macAddress) {
        for (const iface of macAddress) {
          if (iface.family === 'IPv4') {
            findMacAddress = iface.mac
          }
        }
      } else {
        console.log('MAC Address not found');
      }
    } else if(os.platform() === "darwin") {
      const macAddress = networkInterfaces?.en1?.find((iface) => iface?.mac !== '00:00:00:00:00:00')?.mac;
      findMacAddress = macAddress
    }

    // next()

    const settings = await SettingModel.findOne({ "company.macAllowed": findMacAddress })
    if(settings) {
      next()
    } else {
      // next()
      res.status(300).json("This machine is not authorized.")
    }
  } catch (err) {
    res.status(500).json({err: err.message})
  }
}

module.exports = { checkComputer }