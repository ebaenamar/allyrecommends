'use client';

import React from 'react';

export default function LandingPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>AllyRecommends</h1>
      <p>Your personal dietary assistant for healthier food choices</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/chat" style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', borderRadius: '0.25rem', textDecoration: 'none' }}>
          Start Your Health Journey
        </a>
      </div>
    </div>
  );
}
