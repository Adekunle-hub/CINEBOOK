import React from 'react'

const Features = () => {
  return (
    <div>
         <section className="border-t border-border bg-card py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className=" text-xl md:text-3xl font-bold mb-4 md:mb-12">Why Choose Ibadan Movie Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                title: "Premium Cinemas",
                description:
                  "Easy Access to the best cinemas in Ibadan with state-of-the-art facilities",
              },
              {
                title: "Easy Booking",
                description:
                  "Simple and intuitive seat selection with real-time availability",
              },
              {
                title: "Secure Payment",
                description:
                  "Fast and secure payment processing with Stripe integration",
              },
            ].map((feature, i) => (
              <div key={i} className="space-y-2">
                <h3 className="font-bold text-base md:text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features
