
const sendTokenResponse = async(statusCode, user, res, message) =>{

    const Token = await user.generateAccessToken();
    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY *60 *60 *1000
        ),
        httpOnly: true,
        secure: true
    };
     
    // res with cookies
    res.status(statusCode).cookie("Token", Token, options).json({
        success: true,
        message: message,
        user, 
        Token
    });
};

export default sendTokenResponse;

