import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // TODO: Implement your authentication logic here
    // This is a mock implementation - replace with your actual authentication

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Verify credentials against your database
    // For now, we'll use mock authentication
    if (email === 'demo@example.com' && password === 'password') {
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: email,
        avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
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
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}