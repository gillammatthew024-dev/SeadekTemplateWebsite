// src/components/About.tsx
'use client';

import { myFont } from './MyFont';
import { Sparkles, Award, Users, TrendingUp } from 'lucide-react';
import './About.css';

export function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Main Brand Banner */}
        <div className="brand-banner">
          <div className="brand-banner-glow" />
          <div className="brand-content">
            <div className="brand-icon-wrapper">
              <Sparkles className="brand-icon" size={48} />
            </div>
            <h2 
              className={`brand-title ${myFont.className}`}
              style={{
                background: 'linear-gradient(90deg, #b16707ff 0%, #ccb532ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              POLISH PERFECTION
            </h2>
            <div className="brand-subtitle-wrapper">
              <div className="brand-divider" />
              <p className="brand-subtitle">
                Where Excellence Meets Innovation
              </p>
              <div className="brand-divider" />
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="about-content">
          <p className="about-description">
            At <span className="brand-highlight">Polish Perfection</span>, we don't just detail vehicles—we 
            transform them into masterpieces. With cutting-edge techniques, premium products, and an 
            unwavering commitment to excellence, we deliver results that exceed expectations every time.
          </p>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-gold">
                <Award size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-number">10+</div>
                <div className="stat-label">Years Experience</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-blue">
                <Users size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-purple">
                <TrendingUp size={28} />
              </div>
              <div className="stat-content">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="values-grid">
            <div className="value-item">
              <div className="value-marker" />
              <div>
                <h4 className="value-title">Premium Quality</h4>
                <p className="value-text">
                  We use only the finest products and techniques to ensure your vehicle receives the best care possible.
                </p>
              </div>
            </div>

            <div className="value-item">
              <div className="value-marker" />
              <div>
                <h4 className="value-title">Expert Craftsmanship</h4>
                <p className="value-text">
                  Our certified technicians bring years of expertise and passion to every detail.
                </p>
              </div>
            </div>

            <div className="value-item">
              <div className="value-marker" />
              <div>
                <h4 className="value-title">Customer First</h4>
                <p className="value-text">
                  Your satisfaction is our priority. We go above and beyond to exceed your expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}