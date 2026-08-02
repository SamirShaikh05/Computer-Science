export function generateOtp(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

export function HtmlOtp(otp){
    return `
    <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p style="font-size: 18px; color: #555;">Please use the following OTP to verify your account:</p>
        <div style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</div>
        <p style="font-size: 14px; color: #999;">This OTP is valid for a limited time. Please do not share it with anyone.</p>
    </div>
    `;
}
