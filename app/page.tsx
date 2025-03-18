import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Eat Better. Feel Better. Live Better.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Your Personal <span className="text-green-600">Dietary Ally</span> for Healthier Choices
            </h1>
            <p className="text-xl text-gray-600">
              AllyRecommends helps you make healthier food choices with personalized recommendations from UberEats, gamified health tracking, and direct ordering links.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/chat">
                  Start Your Health Journey
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">
                  Learn How It Works
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-[400px]">
              <Image 
                src="/images/ally-health-score.svg" 
                alt="AllyRecommends Health Score" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-it-works" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How AllyRecommends Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered chatbot helps you make healthier food choices while making the process fun and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                🥗
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Recommendations</h3>
              <p className="text-gray-600">
                Tell us your dietary preferences and health goals, and we'll recommend the healthiest options from UberEats restaurants near you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                🏆
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gamified Health Tracking</h3>
              <p className="text-gray-600">
                Earn points, unlock achievements, and watch your health score grow as you make healthier food choices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-green-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Ordering</h3>
              <p className="text-gray-600">
                Get direct UberEats ordering links for your recommended meals, making healthy eating as convenient as possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score Section */}
      <div className="py-16 bg-gradient-to-r from-green-500 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Track Your Health Journey</h2>
              <p className="text-xl">
                Our gamified health score system makes eating healthy fun and rewarding. Earn points for making better choices, unlock achievements, and compete with friends.
              </p>
              <ul className="space-y-3">
                {[
                  'Personalized health score based on your food choices',
                  'Unlock achievements as you reach health milestones',
                  'Track your progress and maintain healthy streaks',
                  'Get healthier alternatives to your favorite meals'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-green-300">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="bg-white text-green-700 hover:bg-green-100">
                <Link href="/chat">
                  Start Earning Points
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="relative w-full h-[300px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative h-32 w-32 mx-auto">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset="70"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">85</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mt-4">Your Health Score</h3>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4">
                  {['🥗', '🍎', '🥑', '🍗', '🥦'].map((emoji, index) => (
                    <div key={index} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah J.',
                role: 'Busy Professional',
                quote: 'AllyRecommends has transformed how I order food. I've lost 10 pounds just by following the healthier alternatives!',
                avatar: '👩🏽'
              },
              {
                name: 'Michael T.',
                role: 'Fitness Enthusiast',
                quote: 'The gamification aspect keeps me motivated. I love unlocking new achievements and watching my health score rise.',
                avatar: '👨🏻'
              },
              {
                name: 'Priya K.',
                role: 'Student',
                quote: 'As a college student with a tight budget, this app helps me find affordable AND healthy options on UberEats. Game changer!',
                avatar: '👩🏾'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Health Journey?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of users who are making healthier food choices every day with AllyRecommends.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
            <Link href="/chat">
              Chat with AllyRecommends Now
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">AllyRecommends</h2>
              <p className="text-gray-400 mt-2">Your personal dietary ally for healthier choices</p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white">Terms</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AllyRecommends. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
