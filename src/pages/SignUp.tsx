// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Logo } from '@/components/layout/Logo';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

// export default function SignUp() {
//   const [step, setStep] = useState(1);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const passwordRequirements = [
//     { label: 'At least 8 characters', met: password.length >= 8 },
//     { label: 'Contains a number', met: /\d/.test(password) },
//     { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
//   ];

//   const allRequirementsMet = passwordRequirements.every((r) => r.met);

//   const handleContinue = () => {
//     if (step === 1 && firstName && lastName) {
//       setStep(2);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!allRequirementsMet || !agreedToTerms) return;

//     setError('');
//     setIsLoading(true);

//     try {
//       await signup(email, password, firstName, lastName);
//       navigate('/therapist-selection');
//     } catch (err) {
//       setError('Something went wrong. Please try again.');
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

//           {step === 1 ? (
//             <>
//               <h1 className="text-3xl font-bold mb-2">Welcome to MyT+</h1>
//               <p className="text-muted-foreground mb-8">
//                 Let's start with your name
//               </p>

//               <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium mb-2">
//                       First name
//                     </label>
//                     <input
//                       id="firstName"
//                       type="text"
//                       value={firstName}
//                       onChange={(e) => setFirstName(e.target.value)}
//                       required
//                       className="input-field"
//                       placeholder="Alex"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium mb-2">
//                       Last name
//                     </label>
//                     <input
//                       id="lastName"
//                       type="text"
//                       value={lastName}
//                       onChange={(e) => setLastName(e.target.value)}
//                       required
//                       className="input-field"
//                       placeholder="Thompson"
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full btn-primary py-6"
//                   disabled={!firstName || !lastName}
//                 >
//                   Continue
//                 </Button>
//               </form>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setStep(1)}
//                 className="text-sm text-muted-foreground hover:text-foreground mb-4"
//               >
//                 ← Back
//               </button>
//               <h1 className="text-3xl font-bold mb-2">Create your account</h1>
//               <p className="text-muted-foreground mb-8">
//                 Hi {firstName}! Set up your login credentials
//               </p>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {error && (
//                   <div className="p-3 rounded-lg bg-crisis/10 text-crisis text-sm">
//                     {error}
//                   </div>
//                 )}

//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium mb-2">
//                     Email address
//                   </label>
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="input-field"
//                     placeholder="you@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium mb-2">
//                     Create password
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="password"
//                       type={showPassword ? 'text' : 'password'}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className="input-field pr-10"
//                       placeholder="••••••••"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                     >
//                       {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                     </button>
//                   </div>

//                   <div className="mt-3 space-y-2">
//                     {passwordRequirements.map((req) => (
//                       <div key={req.label} className="flex items-center gap-2 text-sm">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                           req.met ? 'bg-success' : 'bg-muted'
//                         }`}>
//                           {req.met && <Check className="w-3 h-3 text-success-foreground" />}
//                         </div>
//                         <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
//                           {req.label}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     checked={agreedToTerms}
//                     onChange={(e) => setAgreedToTerms(e.target.checked)}
//                     className="mt-1"
//                   />
//                   <label htmlFor="terms" className="text-sm text-muted-foreground">
//                     I agree to the{' '}
//                     <a href="#" className="text-primary hover:underline">Terms of Service</a>
//                     {' '}and{' '}
//                     <a href="#" className="text-primary hover:underline">Privacy Policy</a>
//                   </label>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full btn-primary py-6"
//                   disabled={isLoading || !allRequirementsMet || !agreedToTerms || !email}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Creating account...
//                     </>
//                   ) : (
//                     'Create Account'
//                   )}
//                 </Button>
//               </form>
//             </>
//           )}

//           <p className="mt-8 text-center text-muted-foreground">
//             Already have an account?{' '}
//             <Link to="/signin" className="text-primary hover:underline font-medium">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Right Panel - Decorative */}
//       <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background to-primary/5 items-center justify-center p-8">
//         <div className="max-w-md text-center">
//           <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
//             <span className="text-4xl">🌱</span>
//           </div>
//           <h2 className="text-2xl font-bold mb-4">Begin your journey</h2>
//           <p className="text-muted-foreground">
//             Join thousands who've found meaningful support through personalized AI therapy.
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

export default function SignUp() {
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.fullName)
    } catch (error) {
      console.error('Signup error:', error)
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
          <CardTitle className="text-2xl text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Start your journey with MyT+
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

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
                placeholder="At least 6 characters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter your password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}