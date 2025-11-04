import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;
const TOKEN_EXPIRY = '90d'; // 90 days - extended for development

if (!JWT_SECRET) {
  throw new Error(
    'NEXTAUTH_SECRET environment variable is required. Please set it in your .env file.'
  );
}

// Ensure JWT_SECRET is treated as a non-null string for the rest of the file
const SECRET: string = JWT_SECRET;

export interface CustomerJWTPayload {
  customerId: string;
  email: string;
}

// Generate JWT token for customer
export function generateCustomerToken(payload: CustomerJWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify customer JWT token
export function verifyCustomerToken(token: string): CustomerJWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as CustomerJWTPayload;
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Register new customer
export async function registerCustomer(
  email: string,
  password: string,
  name: string
) {
  // Check if customer already exists
  const existingCustomer = await prisma.customer.findUnique({
    where: { email },
  });

  if (existingCustomer) {
    throw new Error('Customer with this email already exists');
  }

  // Note: We'll need to add password field to Customer model
  // For now, this will throw an error - need schema migration
  // Creating customer without password for now
  const customer = await prisma.customer.create({
    data: {
      email,
      name,
    },
  });

  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
  };
}

// Authenticate customer with email and password
export async function authenticateCustomer(email: string, password: string) {
  const customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (!customer) {
    return null;
  }

  // Note: Customer model doesn't have password field yet
  // Need to add password field to schema
  // For now, return null
  return null;
}

// Get current customer from request
export async function getCurrentCustomer() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;

    if (!token) {
      return null;
    }

    const payload = verifyCustomerToken(token);

    if (!payload) {
      return null;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: payload.customerId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
      },
    });

    return customer;
  } catch (error) {
    console.error('Error getting current customer:', error);
    return null;
  }
}

// Set customer auth cookie
export async function setCustomerAuthCookie(customerId: string, email: string) {
  const token = generateCustomerToken({ customerId, email });
  const cookieStore = await cookies();

  cookieStore.set('customer_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 90, // 90 days - extended for development
    path: '/',
  });
}

// Clear customer auth cookie
export async function clearCustomerAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_token');
}
