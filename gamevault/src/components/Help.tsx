import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";

type FAQItem = {
  question: string;
  answer: string;
};

export default function Help() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqCategories = {
    general: [
      {
        question: "What is Nexus?",
        answer: "Nexus is a modern gaming platform that allows you to discover, play, and connect with friends over your favorite games. It features a comprehensive library of games, social features, and personalized recommendations."
      },
      {
        question: "How do I create an account?",
        answer: "To create an account, click the 'Sign Up' button on the login page. You'll need to provide an email address, create a password, and choose a username."
      },
      {
        question: "Is Nexus free to use?",
        answer: "Yes, Nexus is free to create an account and use the basic features. Some premium features or games may require additional purchases."
      }
    ],
    account: [
      {
        question: "How do I change my password?",
        answer: "To change your password, go to your Profile settings, select the Security tab, and click on 'Change Password'. You'll need to enter your current password and then your new password."
      },
      {
        question: "Can I change my username?",
        answer: "Yes, you can change your username in your Profile settings. Keep in mind that you can only change your username once every 30 days."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, go to your Profile settings, scroll to the bottom, and click on 'Delete Account'. Please note that this action is permanent and cannot be undone."
      }
    ],
    games: [
      {
        question: "How do I add games to my library?",
        answer: "You can add games to your library by browsing the game catalog and clicking the 'Add to Library' button on any game you want to add."
      },
      {
        question: "Can I share games with friends?",
        answer: "Currently, game sharing is not available, but we're working on implementing this feature in a future update."
      },
      {
        question: "How do I report a bug in a game?",
        answer: "If you encounter a bug in a game, please go to the game's page, scroll down to the 'Report Issues' section, and fill out the form with details about the bug."
      }
    ],
    social: [
      {
        question: "How do I add friends?",
        answer: "You can add friends by searching for their username in the search bar and clicking the 'Add Friend' button on their profile. They'll need to accept your request before you become friends."
      },
      {
        question: "How do I join a server?",
        answer: "To join a server, you'll need an invitation link or code from the server owner. Click on 'Join Server' in the sidebar and enter the invitation code."
      },
      {
        question: "Can I create my own server?",
        answer: "Yes, you can create your own server by clicking the '+' button in the server sidebar and following the setup instructions."
      }
    ]
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-6">
            <h1 className="text-3xl font-bold text-white">Help & Support</h1>
            <p className="text-gray-300 mt-2">
              Find answers to common questions or contact our support team
            </p>
          </div>

          <div className="p-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory("general")}
                className={`px-4 py-2 rounded-lg ${
                  activeCategory === "general"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveCategory("account")}
                className={`px-4 py-2 rounded-lg ${
                  activeCategory === "account"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Account
              </button>
              <button
                onClick={() => setActiveCategory("games")}
                className={`px-4 py-2 rounded-lg ${
                  activeCategory === "games"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Games
              </button>
              <button
                onClick={() => setActiveCategory("social")}
                className={`px-4 py-2 rounded-lg ${
                  activeCategory === "social"
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Social
              </button>
            </div>

            {/* FAQ Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqCategories[activeCategory as keyof typeof faqCategories].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full px-4 py-3 text-left flex justify-between items-center"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      <span className="text-gray-400">
                        {expandedFAQ === index ? (
                          <i className="fas fa-chevron-up"></i>
                        ) : (
                          <i className="fas fa-chevron-down"></i>
                        )}
                      </span>
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-4 py-3 text-gray-300 border-t border-gray-700">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Contact Support
              </h2>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-300 mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="What do you need help with?"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Message</label>
                    <textarea
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg transition-colors"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Resources */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Additional Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-book text-cyan-400"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">User Guide</h3>
                      <p className="text-sm text-gray-400">
                        Comprehensive guide to using Nexus
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-video text-purple-400"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Video Tutorials</h3>
                      <p className="text-sm text-gray-400">
                        Learn with step-by-step video guides
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-users text-cyan-400"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Community Forums</h3>
                      <p className="text-sm text-gray-400">
                        Connect with other users and share tips
                      </p>
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-code text-purple-400"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Developer API</h3>
                      <p className="text-sm text-gray-400">
                        Documentation for developers
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
