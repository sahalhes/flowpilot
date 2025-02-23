import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audio = formData.get("audio") as Blob

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Speech to text conversion failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Speech to text error:", error)
    return NextResponse.json({ error: "Speech to text conversion failed" }, { status: 500 })
  }
}

