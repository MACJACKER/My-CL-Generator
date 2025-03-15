import { NextResponse } from "next/server";
import { checkApiHealth } from "@/lib/api-client";

export async function GET() {
  try {
    // Check if ML backend is available
    const isMLBackendAvailable = await checkApiHealth();
    
    return NextResponse.json({
      status: "success",
      mlBackendAvailable: isMLBackendAvailable,
      message: isMLBackendAvailable 
        ? "ML backend is available and responding" 
        : "ML backend is not available or not responding",
      timestamp: new Date().toISOString(),
      config: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
        useMLBackend: process.env.NEXT_PUBLIC_USE_ML_BACKEND === 'true'
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error checking ML backend:", error);
    
    return NextResponse.json({
      status: "error",
      mlBackendAvailable: false,
      message: "Error checking ML backend status",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 