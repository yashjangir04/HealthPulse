const { makeCall, sendSMS } = require("../services/twilioService");

exports.call = async (req, res) => {
    try {
        const { msg, phoneNumber } = req.body;

        const result = await makeCall(msg, phoneNumber);

        if (result.success) {
            return res.send({ msg: "Call made successful ✅" });
        } else {
            return res.status(500).send({ error: result.error });
        }
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
}

exports.sms = async (req, res) => {
    try {
        const { msg, phoneNumber } = req.body;

        const result = await sendSMS(msg, phoneNumber);

        if (result.success) {
            return res.send({ msg: "SMS sent successfully ✅" });
        } else {
            return res.status(500).send({ error: result.error });
        }

    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
}