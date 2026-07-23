export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-gray">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>

        {[
          {
            title: "Information We Collect",
            content:
              "We collect information you provide directly to us, such as your name, phone number, delivery address, and payment method when you place an order. We also collect information about how you use our website.",
          },
          {
            title: "How We Use Your Information",
            content:
              "We use the information we collect to process orders, communicate with you about your orders, and improve our services. We do not sell your personal information to third parties.",
          },
          {
            title: "Data Security",
            content:
              "We take reasonable measures to protect your information from unauthorized access or disclosure. Your payment information is never stored on our servers.",
          },
          {
            title: "Cookies",
            content:
              "We use cookies to improve your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings.",
          },
          {
            title: "Contact Us",
            content:
              "If you have questions about this Privacy Policy, please contact us at nxteraa953@gmail.com",
          },
        ].map(({ title, content }) => (
          <section key={title} className="mb-8">
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
