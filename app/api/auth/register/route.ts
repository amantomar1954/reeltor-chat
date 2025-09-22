import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // TODO: Implement your user registration logic here
    // - Validate email format
    // - Check if user already exists
    // - Hash password
    // - Save to database

    // Mock implementation
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop`,
      isOnline: true,
    };

    // TODO: Generate real JWT token
    const mockToken = 'mock-jwt-token-' + Date.now();

    return NextResponse.json({
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}