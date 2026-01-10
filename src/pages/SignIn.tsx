// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Logo } from '@/components/layout/Logo';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { Eye, EyeOff, Loader2 } from 'lucide-react';

// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       await login(email, password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError('Invalid email or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left Panel - Form */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <div className="mb-8">
//             <Logo size="lg" />
//           </div>

//           <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
//           <p className="text-muted-foreground mb-8">
//             Sign in to continue your journey
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="p-3 rounded-lg bg-crisis/10 text-crisis text-sm">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium mb-2">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="input-field"
//                 placeholder="you@example.com"
//               />
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label htmlFor="password" className="block text-sm font-medium">
//                   Password
//                 </label>
//                 <a href="#" className="text-sm text-primary hover:underline">
//                   Forgot password?
//                 </a>
//               </div>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="input-field pr-10"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full btn-primary py-6"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </Button>
//           </form>

//           <p className="mt-8 text-center text-muted-foreground">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-primary hover:underline font-medium">
//               Get started
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Right Panel - Decorative */}
//       <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background to-primary/5 items-center justify-center p-8">
//         <div className="max-w-md text-center">
//           <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
//             <span className="text-4xl">💭</span>
//           </div>
//           <h2 className="text-2xl font-bold mb-4">Your safe space awaits</h2>
//           <p className="text-muted-foreground">
//             Continue your therapeutic journey with personalized support, 
//             available whenever you need it.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/layout/Logo'

export default function SignIn() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(formData.email, formData.password)
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to continue your therapeutic journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}