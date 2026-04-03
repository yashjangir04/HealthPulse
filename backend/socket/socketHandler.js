const { setIO , addDoctor, addPatient, removeDoctor, removePatient } = require("../services/matchingService");

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id} ✅`);
        setIO(io) ;

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id} ❌`);
        })

        socket.on("enter-doctor", (data) => {
            addDoctor(data) ;
            console.log(`User ${data._id} entered the doctor room ✅`);
        })
        
        socket.on("enter-patient", (data) => {
            addPatient(data) ;
            console.log(`User ${data._id} entered the patient room ✅`);
        })

        socket.on("leave-doctor", (data) => {
            removeDoctor(data) ;
            console.log(`User ${data._id} left the doctor room ❌`);
            socket.disconnect() ;
        })

        socket.on("leave-patient", (data) => {
            removePatient(data) ;
            console.log(`User ${data._id} left the patient room ❌`);
            socket.disconnect() ;
        })

        socket.on("join-room" , (roomID) => {
            socket.join(roomID) ;
            console.log(`${socket.id} joined room ${roomID}`);
        })

        socket.on("update-notes" , (data) => {
            socket.to(data.roomID).emit("update-notes" , data.notes) ;
        })

        socket.on("update-prescription" , (data) => {
            socket.to(data.roomID).emit("update-prescription" , data.prescriptions) ;
        })
    });
};

module.exports = socketHandler;