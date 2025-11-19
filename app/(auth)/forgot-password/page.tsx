import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { Navbar1 } from '@/components/navigation/nav-bar'
import { Footer } from '@/components/navigation/footer'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar1 />
      
      {/* Main content area that will expand and push footer down */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  )
}