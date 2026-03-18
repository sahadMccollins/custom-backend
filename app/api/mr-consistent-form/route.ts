import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            firstName,
            lastName,
            email,
            phone,
            instagram,
            venue,
            experience,
            promoCode,
            message
        } = body;

        // ✅ Basic validation
        if (!firstName || !lastName || !email || !phone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400, headers: corsHeaders }
            );
        }

        // ✅ Setup transporter (SendGrid)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // ✅ Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO_MR_CONSISTENT,
            subject: "New Bartender Affiliate Form Enquiry",
            html: `
        <h2>New Bartender Affiliate Form Enquiry</h2>

        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <hr/>

        <p><strong>Instagram:</strong> ${instagram}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Promo Code (Preferred):</strong> ${promoCode}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
        });

        return NextResponse.json(
            { success: true },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Email error:", error);

        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500, headers: corsHeaders }
        );
    }
}