import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Если запрос к /profile, перенаправляем в зависимости от роли
  if (pathname === '/profile') {
    // Проверяем cookie с ролью пользователя
    const userRole = request.cookies.get('userRole')?.value;
    
    let destination = '/founder/profile'; // дефолт
    
    if (userRole === 'investor') {
      destination = '/investor/profile';
    } else if (userRole === 'advisor') {
      destination = '/advisor/profile';
    }
    // founder остается дефолтом
    
    return NextResponse.rewrite(new URL(destination, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
  ],
};
