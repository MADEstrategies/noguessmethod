cat > /mnt/user-data/outputs/Privacy.jsx << 'EOF'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function Privacy() {
  return (
    <PageTransition>
      <Header />
      <main className="wrap">
        <div className="blog-post-wrap">
          <div className="blog-post-header">
            <h1 className="blog-post-headline">Privacy Policy</h1>
            <p className="blog-post-meta-date">Last updated: June 2026</p>
          </div>

          <div className="blog-content">
            <h2 className="blog-content-h2">1. Who We Are</h2>
            <p className="blog-content-p">NoGuessMethod ("we", "us", "our") operates noguessmethod.com, a structured training platform for intermediate lifters. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>

            <h2 className="blog-content-h2">2. Information We Collect</h2>
            <p className="blog-content-p">We collect information you provide directly to us when you create an account, including your username, email address, age, gender, fitness level, and training goals. If you subscribe to our premium plan, we collect payment information through our payment processor, Stripe. We do not store your full card details on our servers.</p>
            <p className="blog-content-p">If you enable workout reminders, we may collect your phone number for SMS notifications. We also collect workout logs and training data that you enter into the platform.</p>
            <p className="blog-content-p">We automatically collect certain usage information when you use our service, including your IP address, browser type, pages visited, and time spent on the platform.</p>

            <h2 className="blog-content-h2">3. How We Use Your Information</h2>
            <p className="blog-content-p">We use the information we collect to provide and improve our services, personalise your workout program based on your fitness level and goals, send workout reminders if you have opted in, process payments and manage your subscription, respond to your questions and support requests, and send important account and service updates.</p>
            <p className="blog-content-p">We do not sell your personal information to third parties. We do not use your data for advertising purposes.</p>

            <h2 className="blog-content-h2">4. Data Storage and Security</h2>
            <p className="blog-content-p">Your data is stored securely using Supabase, a managed database platform with industry-standard security practices. Payment processing is handled by Stripe, which is PCI-DSS compliant. Email delivery is handled by Resend. SMS verification is handled by Twilio.</p>
            <p className="blog-content-p">We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>

            <h2 className="blog-content-h2">5. Cookies</h2>
            <p className="blog-content-p">We use essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. We do not use third-party analytics services that track you across other websites.</p>

            <h2 className="blog-content-h2">6. Third-Party Services</h2>
            <p className="blog-content-p">We use the following third-party services to operate our platform: Supabase for database and authentication, Stripe for payment processing, Resend for email delivery, and Twilio for SMS verification and reminders. Each of these services has their own privacy policy governing their use of your data.</p>

            <h2 className="blog-content-h2">7. Data Retention</h2>
            <p className="blog-content-p">We retain your account information for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or financial compliance purposes.</p>

            <h2 className="blog-content-h2">8. Your Rights</h2>
            <p className="blog-content-p">You have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your account and associated data, opt out of marketing communications at any time, and export your data in a portable format upon request.</p>
            <p className="blog-content-p">To exercise any of these rights, contact us at the email address below.</p>

            <h2 className="blog-content-h2">9. Children's Privacy</h2>
            <p className="blog-content-p">Our service is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.</p>

            <h2 className="blog-content-h2">10. Changes to This Policy</h2>
            <p className="blog-content-p">We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice on our website. Your continued use of the service after changes are posted constitutes your acceptance of the updated policy.</p>

            <h2 className="blog-content-h2">11. Contact Us</h2>
            <p className="blog-content-p">If you have any questions about this Privacy Policy or how we handle your data, please contact us at: <strong>support@noguessmethod.com</strong></p>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  )
}
EOF
