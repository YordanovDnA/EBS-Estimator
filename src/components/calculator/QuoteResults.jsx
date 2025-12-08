import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, CheckCircle2, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const services = {
  kitchen: { label: "Kitchen", basePrice: 8500 },
  bathroom: { label: "Bathroom", basePrice: 6500 },
  carpentry: { label: "Carpentry & Joinery", basePrice: 5500 },
  painting: { label: "Painting & Decorating", basePrice: 3500 },
  design: { label: "Design & Management", basePrice: 7500 }
};

const additionalServices = {
  electrical: { label: "Electrical Alterations", basePrice: 3200 },
  plumbing: { label: "Plumbing Alterations", basePrice: 2800 },
  networking: { label: "Network & Data Cabling", basePrice: 1500 },
  security: { label: "Security Systems", basePrice: 2500 },
  heating: { label: "Heating & Boiler", basePrice: 4500 },
  ventilation: { label: "Ventilation Systems", basePrice: 2200 }
};

const sizeMultipliers = {
  small: 1,
  medium: 1.5,
  large: 2.2
};

const propertyTypeLabels = {
  detached: "Detached",
  "semi-detached": "Semi-Detached",
  "end-terrace": "End Terrace",
  terrace: "Terrace",
  bungalow: "Bungalow",
  flat: "Flat/Apartment"
};

const sizeLabels = {
  small: "Small (4-7 units)",
  medium: "Medium (8-12 units)",
  large: "Large (13+ units)"
};

export default function QuoteResults({ formData }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    
    // Calculate services cost
    formData.services?.forEach(serviceId => {
      if (services[serviceId]) {
        total += services[serviceId].basePrice;
      }
    });

    // Calculate additional services cost
    formData.additionalServices?.forEach(serviceId => {
      if (additionalServices[serviceId]) {
        total += additionalServices[serviceId].basePrice;
      }
    });

    // Apply size multiplier
    const multiplier = sizeMultipliers[formData.propertySize] || 1;
    total *= multiplier;

    return Math.round(total);
  };

  const handleEmailQuote = () => {
    // Simulate sending email
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const total = calculateTotal();
  const estimatedWeeks = Math.ceil(formData.services?.length * 2 + formData.additionalServices?.length * 1.5);

  return (
    <div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Your Estimated Quote
        </h2>
        <p className="text-slate-600">
          Based on your selections, here's what we calculate
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Quote Summary */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quote Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-orange-200">
              <span className="text-sm text-slate-600">Property Type</span>
              <span className="font-medium text-slate-900">
                {propertyTypeLabels[formData.propertyType]}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-orange-200">
              <span className="text-sm text-slate-600">Project Size</span>
              <span className="font-medium text-slate-900">
                {sizeLabels[formData.propertySize]}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-orange-200">
              <span className="text-sm text-slate-600">Services</span>
              <span className="font-medium text-slate-900">
                {formData.services?.length || 0} selected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Additional Services</span>
              <span className="font-medium text-slate-900">
                {formData.additionalServices?.length || 0} selected
              </span>
            </div>
          </div>
        </Card>

        {/* Project Details */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Estimated Duration</p>
                <p className="text-sm text-slate-600">{estimatedWeeks} weeks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Project Complexity</p>
                <p className="text-sm text-slate-600">
                  {formData.services?.length > 3 ? "High" : formData.services?.length > 1 ? "Medium" : "Low"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Selected Services Breakdown */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Services Breakdown</h3>
        <div className="space-y-2">
          {formData.services?.map(serviceId => (
            <div key={serviceId} className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-700">{services[serviceId]?.label}</span>
              <span className="font-medium text-slate-900">
                £{(services[serviceId]?.basePrice * sizeMultipliers[formData.propertySize]).toLocaleString()}
              </span>
            </div>
          ))}
          {formData.additionalServices?.map(serviceId => (
            <div key={serviceId} className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-700">{additionalServices[serviceId]?.label}</span>
              <span className="font-medium text-slate-900">
                £{(additionalServices[serviceId]?.basePrice * sizeMultipliers[formData.propertySize]).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-slate-300">
            <span className="text-lg font-bold text-slate-900">Total Estimate</span>
            <span className="text-2xl font-bold text-orange-600">
              £{total.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Email Quote Section */}
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Get Your Detailed Quote</h3>
        <p className="text-sm text-slate-600 mb-4">
          Enter your email to receive a comprehensive breakdown and next steps
        </p>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleEmailQuote}
            disabled={!email || emailSent}
            className="bg-orange-500 hover:bg-orange-600 gap-2"
          >
            {emailSent ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Sent!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Email Quote
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-sm text-blue-800">
          💡 This is an estimated quote. Final costs may vary based on specific requirements and site conditions.
        </p>
      </div>
    </div>
  );
}