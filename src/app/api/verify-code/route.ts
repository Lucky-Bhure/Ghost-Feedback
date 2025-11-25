import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { code, username } = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername});

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 500});
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save();

            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            },{status: 200});
        } else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get a new verification code"
            },{status: 400});
        } else {
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            },{status: 400});
        }

    } catch(error) {
        console.error("Error while verifying user");
        return Response.json({
            success: false,
            message: "Error while verifying user"
        },{status: 500});
    }
}