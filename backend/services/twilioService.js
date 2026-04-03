const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// ‼️Use my(Yash) phoneNumber for trial, Others won't work due to verification stuff :)‼️
// number must be like +(countrycode)(phonenumber)

const makeCall = async (msg, phoneNumber) => {
    try {
        const call = await client.calls.create({
            twiml: `<Response>
                <Say voice="alice" language="en-IN">${msg}</Say>
              </Response>`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        return { success: true, sid: call.sid };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const sendSMS = async (msg, phoneNumber) => {
    try {
        const message = await client.messages.create({
            body: msg,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        return { success: true, sid: message.sid };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { makeCall, sendSMS };