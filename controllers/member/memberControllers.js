const Membership = require('../../models/membership')
const Class = require('../../models/class')
const User = require('../../models/user');
const Payment = require('../../models/payment');
const finincialReport = require('../../models/finincialReport');
const Product = require('../../models/product');
const orderModel = require('../../models/order');

// helpers
const generateTransactionId = require('../../helpers/generateTransactionId');
// view all membership plans
exports.getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find({});
        if (!memberships) {
            res.send('No availble memberships yet')
        } else {
            // res.status(200).json({ state: 'success', data: memberships })
            res.render('memberPages/memberships', { memberships })
        }
    } catch (e) {
        res.status(500).json({ state: 'error', message: e.message });
    }
};
// view single membership plan
exports.getSingleMembership = async (req, res) => {
    try {
        const id = req.params.id;
        const membership = await Membership.findById(id);
        if (!membership) {
            return res.status(404).json({ state: 'error', message: 'No membership found' });
        }
        return res.status(200).json({ state: 'success', data: membership });
        // rendering
    } catch (e) {
        return res.status(500).json({ state: 'error', message: e.message });
    }
};
// join chosen membership CHECK
exports.joinMembershipPlan = async (req, res) => {
    const user = req.user;
    // find the selected membership
    try {
        const planId = req.params.id;
        const selectedPlan = await Membership.findById(planId);
        if (!selectedPlan) return res.status(404).json({ message: 'No Plan found' })
        console.log(selectedPlan);
        //! payment progress
        let userPayment;
        try {
            userPayment = new Payment({
                user: user._id,
                paymentType: 'membershipPlan',
                price: selectedPlan.price,
                paymentMethod: req.body.method,
                transactionId: generateTransactionId(),
                description: selectedPlan.description,
                status: 'completed'
            })
            await userPayment.save();
            user.payments.push(userPayment._id)
        } catch (err) {
            return res.status(400).json({ state: 'error', message: 'error creating payment', content: err.message })
        }
        //!
        //! add the revnue of this payment
        const finincial = new finincialReport({
            revenue: selectedPlan.price,
            category: 'membershipPlan',
            planType: selectedPlan.package
        })
        await finincial.save();
        // add it's id to the user property membershiPlan
        user.membershipPlan = selectedPlan._id;
        const userPlan = await User.findById(user._id).populate('membershipPlan');
        //save user
        await user.save({ validateBeforeSave: false });
        return res.status(200)
            .json({
                state: 'success', plan: userPlan.name,
                payment: userPayment.transactionId
            });

    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message })
    }
}
// view my profile page

// view all available classes
exports.ViewAllClasses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        let query = {};

        if (search) {
            if (!isNaN(search)) {
                query._id = search;
            } else {
                query.name = { $regex: search, $options: 'i' };
            }
        }
        const ClassesCount = await Class.countDocuments(query)
        const totalPages = Math.ceil(ClassesCount / limit);
        const classes = await Class.find(query).skip(page * limit).limit(limit);
        if (classes.length < 1) {
            return res.status(404).json({ state: 'error', message: 'No classes yet' });
        }
        // res.status(200).json({ state: 'success', data: classes });
        res.render('memberPages/allClasses', { classes });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
}
// join class
exports.joinClass = async (req, res) => {
    try {
        // find the current user
        const user = req.user
        // find the selected class by id
        const sessionId = req.params.id
        // Check if the session is already in the enrolledSession array
        if (user.enrolledSessions.some(session => session._id.equals(sessionId))) {
            return res.status(400).json({ message: 'You are already enrolled this session' });
        }
        // find the selected class
        const session = await Class.findById(sessionId)
        if (!session) return res.status(404).json({ state: 'error', message: 'No class found' })
        //! payment progress
        let userPayment;
        try {
            userPayment = new Payment({
                user: user._id,
                paymentType: 'Class Registration',
                price: session.price,
                paymentMethod: req.body.method,
                transactionId: generateTransactionId(),
                description: session.description,
                status: 'completed'
            })
            await userPayment.save();
            user.payments.push(userPayment._id)
        } catch (err) {
            return res.status(400).json({ state: 'error', message: 'error creating payment', content: err.message })
        }
        //!
        //! add the revnue of this payment
        const finicialReport = new finincialReport({
            revenue: session.price,
            category: 'Class Registration',
            classId: session._id,
            paymentId: userPayment._id,
        })
        await finicialReport.save();
        // Add the new session to the enrolledSession array
        user.enrolledSessions.push(sessionId);
        // Save the updated user object back to the database
        await user.save({ validateBeforeSave: false });
        // add the user to the class members array
        session.members.push(user._id);
        // save the updated session object back to the database
        await session.save({ validateBeforeSave: false });
        res.status(200).json({ state: 'success', message: 'Session saved successfully' });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
// unEnroll session
exports.unEnrollClass = async (req, res) => {
    try {
        const user = req.user
        const sessionId = req.params.id;
        const session = await Class.findById(sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });
        // remove 
        await User.updateOne({ email: user.email },
            { $pull: { enrolledSessions: sessionId } });
        // remove
        await Class.updateOne({ _id: sessionId },
            { $pull: { members: user._id } });
        return res.status(200).json({ state: 'succecss', message: 'Unenrolled' });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
}
// rate class
exports.rateClass = async (req, res) => {
    const sessionId = req.params.id;
    const user = req.user;
    try {
        // Find the class by its ID
        const selectedSession = await Class.findById(sessionId);
        if (!selectedSession) {
            return res.status(404).json({ message: 'session not found' });
        }
        // TODO: Add the new rating to the class
        const newRating = {
            user: user._id,
            rating: req.body.rating
        };
        selectedSession.rate.push(newRating);
        // TODO: Calculate the total rating and update the class
        const totalRatings = selectedSession.rate.reduce((total, current) => total + current.rating, 0);
        const averageRating = totalRatings / selectedSession.rate.length;
        // TODO: Send the appropriate response
        selectedSession.averageRating = averageRating;
        await selectedSession.save({ validateBeforeSave: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// view my classes
exports.ViewMyClasses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        const Expression = new RegExp(search, 'i');
        // find the current user
        const CurrentUser = req.user;
        // check if user is member
        if (CurrentUser.role !== 'member') return res.json({ state: 'error', message: 'Only for members' })
        // find all classes for that user
        const user = await User.findOne({ _id: CurrentUser._id }).populate('enrolledSessions');

        let memberSessions = user.enrolledSessions
        // console.log(memberSessions);
        const classTrainer = await Class.populate(memberSessions, { path: 'classTrainer' });
        // const attendance = await Class.populate(memberSessions, {path: 'attendance'})
        // search handling
        if (search) {
            memberSessions = memberSessions.filter(session => {
                return (
                    session.name.match(Expression) ||
                    session._id && session._id.toString().match(Expression)
                )
            })
        }
        const totalPages = Math.ceil(memberSessions.length / limit);
        const paginatedMembers = memberSessions.slice(page * limit, (page + 1) * limit);
        // console.log(paginatedMembers)
        // send it in a response
        if (paginatedMembers.length < 1) return res.json('No classes joined yet!')
        // return res.status(200).json({ state: 'success', data: userSessions });
        // rendering
        res.render('memberPages/myClasses', { paginatedMembers, Pages: totalPages })
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message });
    }
};
// view my single class
exports.viewMySingleClass = async (req, res) => {
    try {
        const id = req.params.id;
        const singleClass = await Class.findById(id);
        if (!singleClass) {
            return res.status(404).json({ state: 'error', message: 'No class found' });
        }
        res.status(200).json({ state: 'success', data: singleClass });
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// track my attendance
exports.viewMyAttendance = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""
        const Expression = new RegExp(search, 'i');
        // FIND THE CURRENT USER
        const currentUser = req.user
        // FIND THE USER AND POPULATE HIS ATTENDACE RECORDS 
        const member = await User.findOne({ _id: currentUser._id }).populate('attendance');
        // STORE THE ATTENDACE IN A VARIABLE
        const memberAttendance = member.attendance
        // search handling
        if (search) {
            memberAttendance = memberAttendance.filter(attendance => {
                return (
                    attendance.id && attendance.id.toString().match(Expression)
                )
            })
        }
        const totalPages = Math.ceil(memberSessions.length / limit);
        const paginatedMemberAttendances = memberAttendance.slice(page * limit, (page + 1) * limit);
        // RENDER AND SEND IT IN A RESPONSE
        res.render('memberPages/myAttendance', { paginatedMemberAttendances })
    } catch (err) {
        res.status(500).json({ state: 'error', message: err.message });
    }
}
// my payment history
exports.viewPaymentHistory = async (req, res) => {
    try {
        // FIND THE CURRENT USER
        const currentUser = req.user;
        // FIND THE USER AND POPULATE HIS ATTENDANCE RECORDS
        const member = await User.findOne({ _id: currentUser._id }).populate('Payments');
        // STORE ATTENDANCE IN A VARIABLE
        const memberPayments = member.payments;
        // SEND IT TO CLIENT IN A RESPONSE
        return res.status(200).json({ state: 'success', data: memberPayments });
    } catch (err) {
        return res.status(500).json({ state: 'error', message: err.message })
    }
}
// BMI Calculator
exports.calculateBMI = (req, res) => {
    const { weight, height } = req.body;
    // CALCULATE THE BMI
    const BMI = weight / Math.pow(height, 2);
    res.status(200).render('memberPages/calculatebmi', { BMI })
}
// member update himself
exports.updateMe = async (req, res) => {

}
// view store products
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || ""

        const products = await Product.find({
            status: 'available',
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { id: parseInt(search) || 0 }
            ],
        }).skip(page * limit).limit(limit);
        if (products.length === 0) return res.status(404).json('No products yet');
        // res.status(200).json({ state: 'sucess', data: products })
        res.render('memberPages/products', { products: products })
    } catch (err) {
        res.status(500).json({ state: "error", message: err.message });
    }
} //! DONE!
// view single product
exports.getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const singleProduct = await Product.findById(productId);
        if (!singleProduct) return res.status(404).json({ state: "error", message: 'Product not found' })
        return res.status(404).json({ state: "success", data: singleProduct });
    } catch (err) {
        return res.status(500).json({ state: "error", message: err.message });
    }
} //! DONE!
// add product to cart
exports.addProductToCart = async (req, res) => {
    try {
        // get the current user
        const user = req.user;
        // get the selected product
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        // check if the product is already in user's cart
        const productIndex = user.cart.items.findIndex(item => item.productId === productId)
        // if the product is exists increment the quantity
        if (productIndex !== -1) {
            user.cart.items[productIndex].quantity += 1;
        } else {
            // add new one
            // push the product to user's cart
            user.cart.items.push({
                productId,
                quantity: 1,
                price: product.price
            })
        }
        // save the user
        const response = await user.save({ validateBeforeSave: false });
        // send a response
        return res.status(200).json({
            status: 'success',
            response: response
        });
        // catch potiential errors
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: err.message });
    }
}
// get my cart
exports.getmyCart = async (req, res) => {
    try {
        // get the current user
        const user = req.user;
        // store the cart items
        const cartItems = user.cart.items;
        // send it in a response
        res.status(201).render('memberPages/myCart', { cartItems: cartItems });
        // catch potiential errors
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}
// delete product from cart
exports.deleteproductFromCart = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.productId;
        if (productId) {
            const updatedCart = await User.updateOne(
                { _id: user._id },
                { $pull: { "cart.items": { productId: itemIdAsObjectId } } }
            )
            res.status(200).json({ status: 'deleted the selected product', data: updatedCart })
        } else {
            const updatedCart = await User.updateOne(
                { _id: user._id },
                { $set: { cart: { items: [] } } }
            )
            res.status(200).json({ status: 'deleted all', data: updatedCart })
        }
    } catch (err) {
        res.status(200).json(err.message)
    }
}
// make an order
exports.createOrder = async (req, res) => {
    try {
        const user = req.user;
        const cartItems = user.cart.items
        const newOrder = new orderModel({
            items: cartItems,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        })
        const savedOrder = await newOrder.save();
        return res.status(200).json({
            status: 'success',
            data: savedOrder
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
} // complete



// Pages
