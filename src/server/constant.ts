const legacy = process.env.NODE_ENV === 'development' ? "_legacy": ""

export const sessionCookieName = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}${legacy}`


