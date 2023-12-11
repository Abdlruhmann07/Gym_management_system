
const User = require("../../models/user");
const Class = require("../../models/class");
const Announcement = require("../../models/classAnnouncement");

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
exports.postAnnouncement = async (req, res) => {
    try {
        const {
            title,
            content,
            attachments
        } = req.body
        const sessionId = req.params.id
        const currUser = req.user
        // FIND THE SELECTED CLASS
        const selectedClass = await Class.findById(sessionId);
        if (!selectedClass) return res.status(404).json({ state: 'error', message: 'Class not found' })
        // ADD NEW ONE
        const announcement = new Announcement({
            title,
            content,
            author: currUser._id,
            class: selectedClass._id,
            attachments
        })
        await announcement.save()
        // Push the announcement to the class announcement list
        await selectedClass.push(announcement._id)
        await selectedClass.save();
        return res.status(200).json({ state: 'success', date: announcement });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
//! VIEW ALL ANNOUNCEMENTS
exports.viewAllClassAnnouncement = async (req, res) => {
    try {
        //? FIND THE SESSION ID FROM THE REQUEST PARAMETERS
        const sessionId = req.params.id
        //? FIND THE SESSION ASSOCIATED TO THIS ID AND POPULATE THE ANNOUNCEMTNS
        const session = await Class.findById(sessionId).populate('announcements')
        if (!session) {
            return res.status(404).json({
                state: 'error', message: 'Class Not Found'
            })
        }
        //? STORE THE ANNOUNCEMENTS
        const sessionAnnouncements = session.announcements
        //? SEND IT IN A RESPONSE
        return res.status(200).json({ state: 'success', data: sessionAnnouncements })
        //? CATCH POTIENTIAL ERROS
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
}
//! EDIT ANNOUNCEMENT
exports.updateAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            announcementId, req.body, { new: true }
        )
        if (!updatedAnnouncement) return res.status(404).json({ state: 'error', message: err.message });
        return res.status(200).json({ state: 'success', data: updatedAnnouncement });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
//! DELETE ANNOUNCEMENT
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id
        const deletedAnnouncement = await Announcement.findByIdAndDelete(announcementId)
        if (!deletedAnnouncement) return res.status(404).json('Announcement Not found')
        return res.status(200).json({ state: 'success', data: deletedAnnouncement });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}