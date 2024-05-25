const generateToken = require('../generateToken')
const User = require('../models/User')

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body

        let user = await User.findOne({ email })
        if (user) {
            return res.status(404).json({ success: false, message: 'User already exists' })
        }

        user = await User.create({
            name,
            email,
            password,
            pic
        })

        const token = await generateToken(user._id)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: token
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.authUser = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await User.findOne({ email }).select('+password')

        if (user && ((await user.matchPassword(password)))) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token: generateToken(user._id),
            })
        }
        else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.allUsers = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        res.send(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}