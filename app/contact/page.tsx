"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "info@calgaryetz.com",
    href: "mailto:info@calgaryetz.com",
    description: "We respond within 24 hours",
  },
  {
    title: "Phone",
    value: "(403) 555-0123",
    href: "tel:+14035550123",
    description: "Mon-Sat, 10am-6pm MST",
  },
  {
    title: "Facebook Messenger",
    value: "Message Us",
    href: "https://www.facebook.com/marketplace/profile/100082510053081",
    description: "Quick responses via Messenger",
  },
]

const locations = [
  { name: "Calgary (HQ)", address: "123 Luxury Lane, Calgary, AB T2P 1A1" },
  { name: "Toronto", address: "456 Bay Street, Toronto, ON M5H 2Y4" },
  { name: "Edmonton", address: "789 Jasper Ave, Edmonton, AB T5J 1N9" },
]

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">Contact Us</h1>
          <p className="text-gray-400">We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {contactMethods.map((method) => (
              <div key={method.title}>
                <h3 className="font-medium mb-1">{method.title}</h3>
                <a href={method.href} className="text-gold hover:underline">
                  {method.value}
                </a>
                <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium text-center mb-8">Send a Message</h2>

          {isSubmitted ? (
            <div className="bg-gold/10 border border-gold rounded-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-serif text-2xl font-medium mb-2">Message Sent!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormState({ name: "", email: "", phone: "", subject: "", message: "" })
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="(403) 555-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formState.subject}
                    onValueChange={(value) => setFormState({ ...formState, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Watch Purchase Inquiry</SelectItem>
                      <SelectItem value="sell">Selling My Watch</SelectItem>
                      <SelectItem value="trade">Trade-In</SelectItem>
                      <SelectItem value="sourcing">Watch Sourcing Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-black font-medium"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
