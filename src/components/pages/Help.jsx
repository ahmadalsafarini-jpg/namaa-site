import { motion } from "framer-motion";
import { Card } from "../ui";
import { Mail, Phone, BookOpen, MessageCircle, HelpCircle, ChevronRight, ExternalLink, Clock, MapPin } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      q: "How do I submit a new solar application?",
      a: "Click 'New Application' from your dashboard, fill in facility details, upload energy bills, and submit. We'll match you with suitable solar companies within 24 hours."
    },
    {
      q: "What documents do I need to upload?",
      a: "You'll need recent energy bills (last 12 months recommended), site photos, and any existing load data. All documents can be uploaded in PDF or image format."
    },
    {
      q: "How long does the matching process take?",
      a: "Our AI-powered matching typically provides 2-3 competitive offers within 24 hours of submission."
    },
    {
      q: "What financing options are available?",
      a: "We offer PPA (Power Purchase Agreements), solar leasing, and traditional bank financing through our partners including QDB, QNB, and Kahramaa."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Help & Support
          </h1>
          <p className="text-xl text-slate-600">
            We're here to help you go solar
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid gap-6 md:grid-cols-3 mb-12"
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-100 group">
            <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Email Support</h3>
            <p className="text-sm text-slate-600 mb-4">Get help via email. We typically respond within 24 hours.</p>
            <a 
              href="mailto:info@namaa.energy" 
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm group"
            >
              info@namaa.energy
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-100 group">
            <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Phone Support</h3>
            <p className="text-sm text-slate-600 mb-4">Call us during business hours for immediate assistance.</p>
            <a 
              href="tel:+97433085766" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              +974 3308 5766
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <Clock className="h-3 w-3" />
              Sun-Thu, 9:00-17:00 GST
            </div>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-100 group">
            <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Office Location</h3>
            <p className="text-sm text-slate-600 mb-4">Visit us at our Doha office for in-person consultations.</p>
            <div className="text-purple-600 font-medium text-sm">
              Doha, Qatar
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 mb-4">
              <BookOpen className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-14 w-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Documentation & Guides</h3>
                  <p className="text-emerald-100">
                    Learn how to submit applications, review offers, track projects, and more.
                  </p>
                </div>
              </div>
              <button className="group flex-shrink-0 inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                View Docs
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 mb-4">Still need help? Our support team is here for you.</p>
          <a
            href="mailto:info@namaa.energy"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
