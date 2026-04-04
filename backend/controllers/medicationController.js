const Patient = require("../models/patient-model");
const Appointment = require("../models/appointment-model");

exports.getPrescribedMedications = async (req, res) => {
    const temp = new set();
    try {
        const appointments = await Appointment.find();
        appointments.forEach(appointment => {
            appointment.prescribedMedicines.forEach(medication => {
                temp.add(medication.name);
            });
        });
        res.json(Array.from(temp));
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getMedications = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id);
        if (!patient) return res.status(404).json({ success: false });

        const today = new Date();
        const todayStart = new Date().setHours(0, 0, 0, 0);// resets time to: 12:00 AM today
        const currentHour = today.getHours();
        const todayName = today.toLocaleDateString('en-US', { weekday: 'long' });

        // Time windows for M, A, E. Night (N) is handled with custom logic.
        const windows = { M: [5, 12], A: [12, 17], E: [17, 21] };

        const processedMeds = patient.medicineReminders
            .filter(med => {
                const isExpired = new Date(med.endDate) < todayStart;
                // AUTO-REMOVE: If time is up AND pills are gone, remove from list
                if (isExpired && med.totalDosesRemaining <= 0) return false;
                return true;
            })
            .map(med => {
                const medObj = med.toObject();
                const schedule = { ...medObj.schedule };

                // Logic Flags
                const isRightDay = med.daysOfWeek.includes(todayName);
                const isExpired = new Date(med.endDate) < todayStart;

                // Extension Logic: If expired but doses are still in the 'bottle'
                medObj.needsExtension = isExpired && med.totalDosesRemaining > 0;
                medObj.missedCount = med.totalDosesRemaining;

                Object.keys(schedule).forEach(slot => {
                    const slotData = schedule[slot];

                    // Skip if not prescribed
                    if (!slotData || slotData.status === "not-prescribed" || slotData === "not-prescribed") return;

                    // If it's the wrong day or the prescription is over, lock it (Gray)
                    if (!isRightDay || isExpired) {
                        schedule[slot] = "locked-gray";
                        return;
                    }

                    // DAILY RESET LOGIC: Check if the 'lastTaken' date was today
                    const lastTakenDate = slotData.lastTaken ? new Date(slotData.lastTaken).setHours(0, 0, 0, 0) : null;
                    const takenToday = lastTakenDate === todayStart;

                    if (takenToday) {
                        schedule[slot] = "taken"; // Stay Green (taken)
                    } else {
                        // Recalculate status based on current time
                        if (slot === 'N') {
                            // Night: 9 PM to 5 AM
                            schedule[slot] = (currentHour >= 21 || currentHour < 5) ? "immediate" : "later";
                        } else {
                            const [start, end] = windows[slot];
                            if (currentHour >= end) schedule[slot] = "missed";
                            else if (currentHour >= start) schedule[slot] = "immediate";
                            else schedule[slot] = "later";
                        }
                    }
                });

                medObj.schedule = schedule;
                return medObj;
            });

        res.status(200).json({ success: true, medications: processedMeds });
    } catch (error) {
        console.error("Master GET Error:", error);
        res.status(500).json({ success: false });
    }
};

// 2. ADD MEDICATION (Calculates total doses for the counter)
exports.addMedication = async (req, res) => {
    try {
        const { medicine, schedule, durationDays, daysOfWeek } = req.body;
        const start = new Date();
        const end = new Date();
        const days = parseInt(durationDays) || 7;
        end.setDate(start.getDate() + days);

        // Count how many slots are used (e.g., M and E = 2)
        const activeSlots = Object.keys(schedule).filter(key => schedule[key] !== "not-prescribed");
        const totalDoses = activeSlots.length * days;

        const newMed = {
            medicine,
            schedule: {
                M: { status: schedule.M || "not-prescribed", lastTaken: null },
                A: { status: schedule.A || "not-prescribed", lastTaken: null },
                E: { status: schedule.E || "not-prescribed", lastTaken: null },
                N: { status: schedule.N || "not-prescribed", lastTaken: null }
            },
            daysOfWeek: daysOfWeek || [],
            startDate: start,
            endDate: end,
            totalDosesRemaining: totalDoses
        };

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.user.id,
            { $push: { medicineReminders: newMed } },
            { new: true }
        );

        res.status(200).json({ success: true, medications: updatedPatient.medicineReminders });
    } catch (error) {
        console.error("ADD ERROR:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. UPDATE STATUS (Decrements counter on 'taken')
exports.updateStatus = async (req, res) => {
    try {
        const { medicationId, slot, status } = req.body;
        const statusField = `medicineReminders.$.schedule.${slot}.status`;
        const dateField = `medicineReminders.$.schedule.${slot}.lastTaken`;

        const updateData = { $set: { [statusField]: status } };

        if (status === "taken") {
            updateData.$set[dateField] = new Date();
            // Subtract 1 from the remaining doses
            updateData.$inc = { "medicineReminders.$.totalDosesRemaining": -1 };
        }

        await Patient.updateOne(
            { _id: req.user.id, "medicineReminders._id": medicationId },
            updateData
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// 4. DELETE
exports.deleteMedication = async (req, res) => {
    try {
        await Patient.findByIdAndUpdate(req.user.id, {
            $pull: { medicineReminders: { _id: req.params.id } }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// 5. EXTEND TREATMENT (Handles the "Continue" button)
exports.extendMedication = async (req, res) => {
    try {
        const { medicationId, extraDays } = req.body;

        // Push the end date forward from today by the number of days needed
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + parseInt(extraDays));

        await Patient.updateOne(
            { _id: req.user.id, "medicineReminders._id": medicationId },
            { $set: { "medicineReminders.$.endDate": newEndDate } }
        );

        res.status(200).json({ success: true, message: "Treatment extended successfully" });
    } catch (error) {
        console.error("Extend Error:", error);
        res.status(500).json({ success: false });
    }
};