// Function to get access token
export const getAccessToken = async (req, res) => {
    try {
        const credentials = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString("base64");

        const response = await fetch(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            {
                method: "GET",
                headers: {
                    Authorization: `Basic ${credentials}`, // ✅ Space fixed
                },
            }
        );

        const data = await response.json();

        if (data.access_token) {
            res.cookie("mpesa_token", data.access_token, {
                httpOnly: true,
                secure: false, // Change to true in production
                sameSite: "Strict",
            }).json({ success: true, message: "Token stored in HttpOnly cookie" });
        } else {
            res.status(400).json({ error: "Failed to generate token" });
        }
    } catch (error) {
        console.error("Error generating access token:", error);
        return res.status(500).json({ error: "Internal Server Error generating the Access Token" });
    }
};

// Function to initiate STK Push
export const stkPush = async (req, res) => {
    try {
        const { phone, amount } = req.body;
        const accessToken = req.cookies.mpesa_token;

        if (!accessToken) {
            return res.status(404).json({ message: "No Mpesa token found" });
        }

        const shortcode = process.env.MPESA_SHORTCODE;
        const passKey = process.env.MPESA_PASSKEY;
        const timestamp = new Date().toISOString().replace(/[-T:]/g, "").split(".")[0];
        const password = Buffer.from(`${shortcode}${passKey}${timestamp}`).toString("base64");
        const requestBody = {
            "BusinessShortCode": shortcode,    
            "Password": password,    
            "Timestamp": timestamp,    
            "TransactionType": "CustomerPayBillOnline",    
            "Amount": amount,   
            "PartyA": phone,    
            "PartyB": "174379",    
            "PhoneNumber": phone, 
            "CallBackURL": "https://mydomain.com/pat",    
            "AccountReference": "Test",    
            "TransactionDesc": "Test",    
            
        };     

        const response = await fetch(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("STK Push Error:", error);
        res.status(500).json({ error: "STK Push Failed" });
    }
};
