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
    value: "info@exclusivetimezone.com",
    href: "mailto:info@exclusivetimezone.com",
    description: "We respond within 24 hours",
  },
  {
    title: "Phone",
    value: "236-334-3434",
    href: "tel:236-334-3434",
    description: "Mon-Sat, by appointment",
  },
  {
    title: "Instagram",
    value: "@exclusivetimezone",
    href: "https://www.instagram.com/exclusivetimezone/",
    description: "Follow us for updates",
  },
]

const locations = [
  {
    name: "Vancouver HQ",
    address: "943 W Broadway, Unit 110, Vancouver, BC V5Z 4E1",
    phone: "236-833-3952",
  },
  {
    name: "Calgary",
    address: "2120 4th Street SW, Unit 210, Calgary, AB T2S 1W7",
    phone: "403-703-6671",
  },
  {
    name: "Toronto",
    address: "25 Sheppard Ave W, North York, ON M2N 6S6",
    phone: "416-298-8666",
  },
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
          <p className="text-gray-400">
            Fill out the form below and we will get back to you as soon as possible.
            <br />
            For the fastest response, call us at{" "}
            <a href="tel:236-334-3434" className="text-gold hover:underline">
              236-334-3434
            </a>
          </p>
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
                    placeholder="236-334-3434"
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

      {/* Locations Section */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-medium text-center mb-8">Our Locations</h2>
          <p className="text-center text-muted-foreground mb-8">All locations by appointment only</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {locations.map((location) => (
              <div key={location.name} className="text-center">
                <h3 className="font-medium mb-2">{location.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
                <a href={`tel:${location.phone}`} className="text-gold hover:underline text-sm">
                  {location.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
