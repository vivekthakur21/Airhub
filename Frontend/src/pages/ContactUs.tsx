import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    toast({
      title: "Message Sent! 📩",
      description: "We've received your message and will get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We're here to help you find your perfect stay.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* Contact Form */}
          <section className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                <input 
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Booking Inquiry"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your needs..."
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>

          {/* Contact Info */}
          <aside className="space-y-8">
            <div className="rounded-3xl border border-border bg-muted/30 p-8">
              <h3 className="mb-6 text-xl font-bold">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                    <a href="mailto:support@staybnb.com" className="text-lg font-medium hover:text-rose-500 transition-colors">support@staybnb.com</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone</p>
                    <a href="tel:+1234567890" className="text-lg font-medium hover:text-rose-500 transition-colors">+1 (234) 567-890</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Address</p>
                    <p className="text-lg font-medium">123 Luxury Ave, Suite 456<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Cards */}
            <div className="rounded-3xl border border-border bg-rose-500 p-8 text-white shadow-lg shadow-rose-500/20">
              <h3 className="mb-2 text-xl font-bold">Follow us online</h3>
              <p className="mb-6 text-rose-100">Stay updated with our latest offers and travel tips.</p>
              <div className="flex gap-4">
                {/* Social icons would go here, reusing footer style */}
                <span className="text-sm font-bold uppercase tracking-widest opacity-60">@staybnb_official</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
