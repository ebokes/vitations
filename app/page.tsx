import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Star,
  ChevronDown,
  ChevronUp,
  Gift,
  MapPin,
  Video,
  Users,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ReviewCard, DemoReviewNotice } from '@/components/review-card';
import { formatCurrency } from '@/lib/utils';
import { PACKAGE_PRICES, PACKAGE_FEATURES } from '@/lib/constants';

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Premium Digital Invitations
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Beautiful Invitations for{' '}
            <span className="text-primary-600">Nigerian Celebrations</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
            Create stunning digital invitations for your weddings, birthdays, and special events. 
            Elegant designs, interactive features, and seamless guest experiences.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/templates">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Invitations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/custom-invitation">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create Your Invitation
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-primary-600/30" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900">Wedding Invitation {i}</h3>
                <p className="text-sm text-neutral-600">Elegant Template</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Templates Section
function FeaturedTemplatesSection() {
  const templates = [
    { id: '1', name: 'Royal Elegance', category: 'Traditional Wedding', badge: 'Popular' },
    { id: '2', name: 'Modern Grace', category: 'White Wedding', badge: 'New' },
    { id: '3', name: 'Golden Celebration', category: 'Reception', badge: 'Premium' },
    { id: '4', name: 'Classic Charm', category: 'Birthday', badge: null },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Featured Templates</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Explore our most popular invitation designs
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Link key={template.id} href={`/templates/${template.id}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200">
                  <Sparkles className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary-600/30" />
                  {template.badge && (
                    <div className="absolute right-2 top-2">
                      <Badge variant={template.badge === 'Popular' ? 'default' : template.badge === 'New' ? 'success' : 'secondary'}>
                        {template.badge}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600">
                    {template.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{template.category}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/templates">
            <Button variant="outline">
              View All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Elegant Designs',
      description: 'Beautiful templates tailored for Nigerian celebrations',
    },
    {
      icon: Users,
      title: 'Interactive Features',
      description: 'RSVP, gift registry, livestream integration, and more',
    },
    {
      icon: Gift,
      title: 'Gift Registry',
      description: 'Premium and Ultimate packages include gift tracking',
    },
    {
      icon: Video,
      title: 'Media Support',
      description: 'Galleries, stories, videos, and guest uploads',
    },
  ];

  return (
    <section className="bg-neutral-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Why Choose Vitations</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Everything you need for a memorable digital invitation experience
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 font-semibold text-neutral-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Package Overview Section
function PackageOverviewSection() {
  const packages = [
    { tier: 'essential' as const, popular: false },
    { tier: 'premium' as const, popular: true },
    { tier: 'ultimate' as const, popular: false },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Choose Your Package</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Select the perfect package for your celebration
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.tier}
              className={`relative flex flex-col ${pkg.popular ? 'border-primary-600 shadow-lg' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold capitalize text-neutral-900">{pkg.tier}</h3>
                <p className="mt-2 text-2xl font-bold text-primary-600">
                  {formatCurrency(PACKAGE_PRICES[pkg.tier])}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {PACKAGE_FEATURES[pkg.tier].slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                      <span className="text-sm text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/packages" className="mt-6">
                  <Button
                    variant={pkg.tier === 'ultimate' ? 'gold' : pkg.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    { number: '01', title: 'Choose a Template', description: 'Browse our collection and pick your favorite design' },
    { number: '02', title: 'Select Package', description: 'Choose Essential, Premium, or Ultimate' },
    { number: '03', title: 'Enter Details', description: 'Fill in your event information and preferences' },
    { number: '04', title: 'Review', description: 'Preview your invitation and make final adjustments' },
    { number: '05', title: 'Confirm & Submit', description: 'Submit your invitation for processing' },
    { number: '06', title: 'Receive Link', description: 'Get your unique invitation link' },
    { number: '07', title: 'Share', description: 'Send your invitation to guests via WhatsApp, SMS, or email' },
  ];

  return (
    <section className="bg-neutral-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">How It Works</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Create your digital invitation in 7 simple steps
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-7">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white">
                <span className="text-sm font-bold">{step.number}</span>
              </div>
              <h3 className="mt-4 font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="mx-auto mt-4 hidden h-5 w-5 text-neutral-400 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Invitation Experience Section
function InvitationExperienceSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              A Seamless Guest Experience
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Your guests receive a beautiful, interactive invitation that works on any device.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-bold text-primary-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Preview Invitation</h3>
                  <p className="text-sm text-neutral-600">Guests see a preview with celebrant details</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-bold text-primary-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Accept & RSVP</h3>
                  <p className="text-sm text-neutral-600">Guests enter their details and confirm attendance</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-bold text-primary-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Full Experience</h3>
                  <p className="text-sm text-neutral-600">Access gallery, gifts, livestream based on package</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
              <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-primary-600/30" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-neutral-900">Adaeze & Emeka</h3>
                <p className="text-sm text-neutral-600">Traditional Wedding</p>
                <p className="text-xs text-neutral-500">December 25, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Customer Reviews Section
function CustomerReviewsSection() {
  const reviews = [
    {
      name: 'Adaeze Okonkwo',
      review: 'Vitations made our wedding invitation so special. The templates are beautiful and the guest experience was seamless!',
      eventType: 'Traditional Wedding',
      socialHandle: '@adaeze_weds',
    },
    {
      name: 'Chidi and Nneka',
      review: 'We loved the gift registry feature. Our guests found it so easy to select and send gifts.',
      eventType: 'White Wedding',
    },
    {
      name: 'Tunde Bakare',
      review: 'The livestream integration was perfect for our family members abroad. Everyone could participate!',
      eventType: 'Birthday Celebration',
    },
  ];

  return (
    <section className="bg-neutral-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">What Our Customers Say</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Join hundreds of happy customers who celebrated with Vitations
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>

        <div className="mt-8">
          <DemoReviewNotice />
        </div>
      </div>
    </section>
  );
}

// Custom Invitation CTA Section
function CustomInvitationCTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-12 sm:px-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Need a Custom Invitation?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Have a unique vision? Our team will create a bespoke invitation tailored to your celebration.
            </p>
            <Link href="/custom-invitation" className="mt-8 inline-block">
              <Button variant="secondary" size="lg">
                Request Custom Design
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: 'What are digital invitations?',
      answer: 'Digital invitations are electronic versions of traditional paper invitations. They can be shared via link and accessed on any device, offering interactive features like RSVP, gift registry, and media galleries.',
    },
    {
      question: 'How do I choose a template?',
      answer: 'Browse our collection and filter by event type or design style. Preview templates before selecting, and switch between eligible templates before final submission.',
    },
    {
      question: 'What is the difference between packages?',
      answer: 'Essential offers basic 2D designs. Premium adds multiple locations, media gallery, and gift registry. Ultimate includes advanced 3D, guest uploads, livestream, and all premium features.',
    },
    {
      question: 'Can I switch templates after selecting one?',
      answer: 'Yes, you can switch between templates available to your paid tier before final submission. Once submitted, changes require admin assistance.',
    },
    {
      question: 'What happens after I submit my invitation?',
      answer: 'After submission, your invitation is locked. Any changes require our admin team to unlock, modify, and relock it. This ensures your guests always see accurate information.',
    },
    {
      question: 'Do invitations expire?',
      answer: 'No. When the event date arrives, the countdown reaches zero but the invitation remains accessible. You retain access to all subscribed features.',
    },
    {
      question: 'How does the gift registry work?',
      answer: 'Premium and Ultimate packages include gift tracking. Guests can indicate intended gifts, and you can track received items. Cash gifts are supported via configured payment methods.',
    },
    {
      question: 'Can guests upload photos?',
      answer: 'Ultimate package includes guest photo uploads with moderation. Selected images can be shared to social platforms. Premium and Essential packages do not include this feature.',
    },
  ];

  return (
    <section className="bg-neutral-50 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Everything you need to know about Vitations
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-lg border border-neutral-200 bg-white">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900">
                {faq.question}
                <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-neutral-200 px-4 pb-4 pt-3 text-neutral-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-neutral-900">
          Ready to Create Your Invitation?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
          Start with a template or request a custom design. Your perfect invitation is just a few clicks away.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/templates">
            <Button size="lg" className="w-full sm:w-auto">
              Explore Templates
            </Button>
          </Link>
          <Link href="/custom-invitation">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Custom Invitation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Main Homepage Component
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedTemplatesSection />
        <WhyChooseUsSection />
        <PackageOverviewSection />
        <HowItWorksSection />
        <InvitationExperienceSection />
        <CustomerReviewsSection />
        <CustomInvitationCTASection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
