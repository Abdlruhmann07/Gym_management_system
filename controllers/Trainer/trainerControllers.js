
const User = require("../../models/user");
const Class = require("../../models/class");

//TODO: VIEW MY PROFILE PAGE
exports.getProfile = (req, res) => {
    const user = req.user;
    res.render('trainerPages/profile', { user })
}
//TODO: VIEW MY SESSIONS & SCHADULE
exports.viewTrainerSessions = async (req, res) => {
    try {
        //* FIND THE CURRENT USER
        const currUser = req.user
        //* FIND THE TRAINER WITH THE ID TO POPULATE THE SESSIONS
        const trainer = await User
            .findOne({ _id: currUser._id })
            .populate('trainerSessions')
        //* STORE THE SESSIONS 
        const trainerSessions = trainer.trainerSessions;
        //* SEND IT IN A RESPONSE
        return res.status(200).json({ state: 'error', data: trainerSessions })
    } catch (e) {
        //* CATCH POTIENIAL ERRORS
        return res.status(500).json({ state: 'error', message: e.message });
    }
}
//TODO: SINGLE SESSIONS OF MY SESSIONS
exports.viewSingleSession = async (req, res) => {
    try {
        //? GET THE SESSION ID FROM REQUEST PARAMETERS
        const sessionId = req.params.id
        //? FIND THE SELCETED SESSION 
        const selectedSession = await Class.findById(sessionId)
        //? CHECK IF THE SESSION IS NOT FOUND
        if (!selectedSession) return res.status(404)
            .json({ state: 'error', message: 'Class Not Found' });
        //? SEND IT IN A RESPONSE
        res.status(200).json({ state: 'success', data: selectedSession });
        //? CATCH POTIENTIAL ERRORS
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
//TODO: VIEW ALL SESSION MEMBERS
exports.viewAllSessionMembers = async (req, res) => {
    try {
        //? GET THE SESSION ID FROM THE REQUEST PARAMETERS
        const sessionId = req.params.id;
        //? FIND THE ASSOCIATED SESSION TO THAT ID AND POPULATE THE MEMBERS
        const session = await Class.findById(sessionId).populate('members')
        //? CHECK IF THE SESSION IS FOUND
        if (!session) return res.status(404).
            json({ state: 'error', message: 'Session not found' });
        //? STORE THE MEMBERS IN A VARIBALE 
        const sessionMembers = session.members
        //? SEND IT IN A RESPONSE
        return res.status(200).json({ state: 'success', data: sessionMembers })
        //? CATCH POTENTIAL ERRORS
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
//TODO: TRACK SESSIONS ATTENDACE
exports.trackSessionAttendance = async (req, res) => {
    try {
        //? GET THE SESSION ID FROM THE REQUEST PARAMETERS
        const sessionId = req.params.id
        //? FIND THE SESSION WITH THE GIVEN ID AND POPULATE ATTENDACE
        const session = await Class.findById(sessionId).populate('attendance')
        //? STORE THE ATTENDANCE
        const sessionAttendance = session.attendance
        //? SEND IT IN A RESPONSE AND RENDER
        return res.status(200).json({ state: 'sucess', data: sessionAttendance })
        //? CATCH POTENTIAL ERRORS
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
//TODO: MANAGE SESSIONS ANNOUNCEMENT
//! ADD NEW ANNOUNCEMENT
//! VIEW ALL ANNOUNCEMENTS
//! EDIT ANNOUNCEMENT
//! DELETE ANNOUNCEMENT

