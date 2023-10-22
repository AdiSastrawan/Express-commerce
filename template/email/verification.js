const verification = (code) => {
  return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Email Template</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
    
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
    
            .otp {
                font-size: 36px;
                margin-bottom: 20px;
            }
    
            .note {
                font-size: 16px;
                color: #888888;
                margin-bottom: 30px;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h1>OTP Verification</h1>
            <p class="otp">Your One-Time Password (OTP) is: <strong>${code}</strong></p>
            <p class="note">Please use this OTP to complete your verification process.</p>
        </div>
    </body>
    
    </html>
    `
}
export default verification
