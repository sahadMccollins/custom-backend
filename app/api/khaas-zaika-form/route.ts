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
            fname,
            lname,
            email,
            phone,
            date,
            time,
            pkg,
            occasion,
            location,
            special,
            prefs,
        } = body;

        // ✅ Basic validation
        if (!fname || !lname || !email || !phone) {
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
            to: process.env.EMAIL_TO,
            subject: "New Catering Enquiry",
            html: `
        <h2>New Catering Enquiry</h2>

        <p><strong>Name:</strong> ${fname} ${lname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <hr/>

        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Package:</strong> ${pkg}</p>
        <p><strong>Occasion:</strong> ${occasion}</p>
        <p><strong>Location:</strong> ${location}</p>

        <hr/>

        <p><strong>Menu Preferences:</strong> ${prefs || "Not specified"}</p>
        <p><strong>Special Requests:</strong> ${special || "None"}</p>
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