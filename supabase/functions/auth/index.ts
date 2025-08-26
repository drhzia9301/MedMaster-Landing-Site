import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterFirebaseRequest {
  email: string;
  username: string;
  firebaseUid: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/auth', '')
    const method = req.method

    // Route handling
    if (method === 'POST' && path === '/login') {
      return await handleLogin(req, supabaseClient)
    } else if (method === 'POST' && path === '/register') {
      return await handleRegister(req, supabaseClient)
    } else if (method === 'POST' && path === '/register-firebase') {
      return await handleRegisterFirebase(req, supabaseClient)
    } else if (method === 'GET' && path === '/profile') {
      return await handleGetProfile(req, supabaseClient)
    }

    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Auth function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleLogin(req: Request, supabase: any) {
  try {
    const { email, password }: LoginRequest = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify password (assuming bcrypt is used)
    const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts')
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create JWT token
    const jwt = await import('https://deno.land/x/djwt@v3.0.2/mod.ts')
    const key = await jwt.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'fallback-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    const token = await jwt.create({ alg: 'HS256', typ: 'JWT' }, payload, key)

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          subscription_status: user.subscription_status,
          subscription_end_date: user.subscription_end_date,
          profile_picture: user.profile_picture
        },
        token,
        userId: user.id.toString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleRegister(req: Request, supabase: any) {
  try {
    const { email, password }: RegisterRequest = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate username from email (for backward compatibility)
    const username = email.split('@')[0]

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Hash password
    const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts')
    const passwordHash = await bcrypt.hash(password)

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        subscription_status: 'demo',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('User creation error:', createError)
      return new Response(
        JSON.stringify({ error: 'Registration failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create JWT token
    const jwt = await import('https://deno.land/x/djwt@v3.0.2/mod.ts')
    const key = await jwt.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'fallback-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const payload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    const token = await jwt.create({ alg: 'HS256', typ: 'JWT' }, payload, key)

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          subscription_status: newUser.subscription_status
        },
        token,
        userId: newUser.id.toString(),
        isNewUser: true
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({ error: 'Registration failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleRegisterFirebase(req: Request, supabase: any) {
  try {
    const { email, username, firebaseUid }: RegisterFirebaseRequest = await req.json()

    if (!email || !username || !firebaseUid) {
      return new Response(
        JSON.stringify({ error: 'Email, username, and firebaseUid are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${email},firebase_uid.eq.${firebaseUid}`)
      .single()

    if (existingUser) {
      // User exists, return existing user data
      const jwt = await import('https://deno.land/x/djwt@v3.0.2/mod.ts')
      const key = await jwt.crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'fallback-secret'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      )

      const payload = {
        userId: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      }

      const token = await jwt.create({ alg: 'HS256', typ: 'JWT' }, payload, key)

      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            subscription_status: existingUser.subscription_status
          },
          token,
          userId: existingUser.id.toString(),
          isNewUser: false
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        firebase_uid: firebaseUid,
        subscription_status: 'demo',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Firebase user creation error:', createError)
      return new Response(
        JSON.stringify({ error: 'Registration failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create JWT token
    const jwt = await import('https://deno.land/x/djwt@v3.0.2/mod.ts')
    const key = await jwt.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'fallback-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const payload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }

    const token = await jwt.create({ alg: 'HS256', typ: 'JWT' }, payload, key)

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          subscription_status: newUser.subscription_status
        },
        token,
        userId: newUser.id.toString(),
        isNewUser: true
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Firebase registration error:', error)
    return new Response(
      JSON.stringify({ error: 'Registration failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleGetProfile(req: Request, supabase: any) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify JWT token
    const jwt = await import('https://deno.land/x/djwt@v3.0.2/mod.ts')
    const key = await jwt.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'fallback-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const payload = await jwt.verify(token, key)
    const userId = payload.userId

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, subscription_status, subscription_end_date, profile_picture, created_at, last_login')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          subscription_status: user.subscription_status,
          subscription_end_date: user.subscription_end_date,
          profile_picture: user.profile_picture,
          created_at: user.created_at,
          last_login: user.last_login
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Get profile error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get profile' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
