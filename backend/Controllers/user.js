const User = require("../Models/user");
const {generateToken} = require('../Controllers/auth');
const { z } = require("zod");

const userSchemaUpdateValidate = z.object({
    firstName: z
        .string({
            required_error: "First Name is required",
            invalid_type_error: "First Name must be a string",
        }),
    lastName: z
        .string({
            required_error: "Last Name is required",
            invalid_type_error: "Last Name must be a string",
        }).optional(),
    phoneNumber: z
        .string({required_error: "Mobile Number is required"})
        .regex(/^[6-9]\d{9}$/,{message:"Invalid Mobile Number."}),
    email: z
        .string({required_error: "Email is required"})
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,{message:"Invalid Email Address."}),
});


const handleUpdateUser = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request.",
            });
        }

        const { firstName, lastName, phoneNumber, email, address } = req.body;

        const validate = userSchemaUpdateValidate.safeParse({
            firstName, 
            lastName, 
            phoneNumber, 
            email, 
        });

        if (validate.success) {
            const updateFields = {
                firstName, 
                lastName,
                phoneNumber, 
                email, 
            };

            const foundUser = await User.findOne({ email: email });
            if (foundUser && foundUser._id.toString() !== userId.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Email Already Exists.",
                });
            }

            const user = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            const token = generateToken(user._id);
            
            return res.status(200).json({
                success:true,
                message:"User Profile Updated Successfully",
                user:{
                    firstName: user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    phoneNumber:user.phoneNumber,
                    role:user.role,
                },
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: validate.error.issues.map((err) => err.message).join(", "),
            });
        }
    } catch (error) {
        console.error("Error Updating User Profile", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue, Please try again!",
        });
    }
};

const handleGetProfile = async (req,res)=>{
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request.",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Profile Fetched Successfully",
            user:{
                firstName: user.firstName,
                lastName:user.lastName,
                email:user.email,
                phoneNumber:user.phoneNumber,
                role:user.role,

            }
        });

    } catch (error) {
        console.error("Error Fetching User Profile",error);
        return res.status(500).json({
            success:false,
            message: "Internal Server Issue, Please try again!",
        });
    }
}

module.exports = {handleGetProfile, handleUpdateUser};