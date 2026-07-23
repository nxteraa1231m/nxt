export default function TermsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: January 2026</p>

        {[
          {
            title: "Acceptance of Terms",
            content:
              "By using NXT, you agree to these Terms of Service. If you do not agree, please do not use our website or services.",
          },
          {
            title: "Orders & Payments",
            content:
              "All orders are subject to availability. Payment must be completed within 24 hours of placing an order via the selected payment method (Vodafone Cash or InstaPay). We reserve the right to cancel orders that are not paid.",
          },
          {
            title: "Shipping & Delivery",
            content:
              "We aim to ship all orders within 1–2 business days. Delivery takes 2–5 business days depending on your location. Shipping fees may apply depending on your area.",
          },
          {
            title: "Returns & Exchanges",
            content:
              "We accept returns within 7 days of delivery for unused items in original condition. Items must not be washed or damaged. Contact us at support@nxtstore.com to initiate a return.",
          },
          {
            title: "Limitation of Liability",
            content:
              "NXT is not responsible for delays caused by courier services or events beyond our control. We are not liable for any indirect or consequential damages.",
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
