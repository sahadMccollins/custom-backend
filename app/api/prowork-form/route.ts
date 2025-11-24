import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
        const { name, email, phone, message } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const apiToken = process.env.PIPEDRIVE_API_TOKEN;
        const baseUrl = "https://prowork.pipedrive.com/api/v1";

        // 1️⃣ Create Person
        const personResponse = await fetch(
            `${baseUrl}/persons?api_token=${apiToken}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                }),
            }
        );

        const personData = await personResponse.json();



        if (!personResponse.ok) {
            return NextResponse.json(
                { error: personData?.error || "Failed to create person" },
                { status: 500, headers: corsHeaders }
            );
        }

        const personId = personData.data.id;

        // 2️⃣ Create Lead
        const leadResponse = await fetch(
            `${baseUrl}/leads?api_token=${apiToken}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `Lead from Website - ${name}`,
                    person_id: personId,
                    "d47d2029837b3d1857da3900e5f887178986ab4c": message
                }),
            }
        );

        const leadData = await leadResponse.json();

        if (!leadResponse.ok) {
            return NextResponse.json(
                { error: leadData?.error || "Failed to create lead" },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            {
                success: true,
                person: personData.data,
                lead: leadData.data,
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error("Error creating lead", error);
        return NextResponse.json(
            { error: "Failed" },
            { status: 500, headers: corsHeaders }
        );
    }
}
