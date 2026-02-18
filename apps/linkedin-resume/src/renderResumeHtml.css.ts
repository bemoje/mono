export default `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Helvetica Neue', sans-serif;
  background: #f4f2ee;
  color: #191919;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: #0a66c2;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
  color: #004182;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Card */
.card {
  background: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  padding: 24px;
  position: relative;
}

.card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #191919;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

/* Profile card */
.profile-card {
  padding: 0;
  overflow: hidden;
}

.profile-banner {
  height: 170px;
  background: linear-gradient(135deg, #004182 0%, #0a66c2 40%, #70b5f9 100%);
}

.profile-body {
  padding: 0 24px 24px;
  position: relative;
}

.profile-photo {
  width: 185px;
  height: 185px;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  margin-top: -130px;
  display: block;
  background: #e8e8e8;
}

.profile-info {
  margin-top: 12px;
}

.profile-info h1 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.profile-headline {
  font-size: 16px;
  color: #191919;
  margin-top: 4px;
}

.profile-location {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.profile-contact {
  margin-top: 12px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
}

.profile-links {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.profile-link {
  display: inline-block;
  padding: 6px 16px;
  border: 1px solid #0a66c2;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #0a66c2;
  transition: all 0.15s;
}
.profile-link:hover {
  background: #0a66c2;
  color: #fff;
  text-decoration: none;
}

/* About */
.about-text {
  font-size: 14px;
  color: #333;
}
.about-text p + p {
  margin-top: 10px;
}

/* Entries (experience, education, projects) */
.entries {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.entry {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #e8e8e8;
}
.entry:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.entry:first-child {
  padding-top: 0;
}

.entry-logo {
  flex-shrink: 0;
}

.logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #666;
}

.entry-logo-img {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: contain;
  background: #fff;
  border: 1px solid #e8e8e8;
}

.entry-content {
  flex: 1;
  min-width: 0;
}

.entry-title {
  font-size: 15px;
  font-weight: 600;
  color: #191919;
  line-height: 1.3;
}

h3.entry-title {
  font-size: 16px;
}

.entry-subtitle {
  font-size: 14px;
  color: #191919;
  margin-top: 2px;
}

.entry-meta {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}

.entry-description {
  font-size: 14px;
  color: #333;
  margin-top: 2px;
  white-space: pre-line;
}

.entry-highlights {
  margin-top: 8px;
  padding-left: 18px;
  font-size: 14px;
  color: #333;
}
.entry-highlights li {
  margin-top: 2px;
}

/* Sub-roles (grouped experience) */
.sub-roles {
  margin-top: 12px;
  border-left: 2px solid #d6d6d6;
  padding-left: 16px;
}

.sub-role {
  position: relative;
  padding: 10px 0;
}
.sub-role:first-child {
  padding-top: 0;
}
.sub-role:last-child {
  padding-bottom: 0;
}

.sub-role-dot {
  position: absolute;
  left: -21px;
  top: 16px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #666;
  border: 2px solid #fff;
}
.sub-role:first-child .sub-role-dot {
  top: 6px;
}

.sub-role-content {
  padding-left: 0;
}

/* Skill pills */
.skill-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.pill {
  display: inline-block;
  padding: 1px 7px;
  background: #ebf3f1;
  border-radius: 10px;
  font-size: 11px;
  color: #444;
  white-space: nowrap;
  line-height: 1.5;
}

/* Media links */
.media-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.media-link {
  display: inline-block;
  padding: 4px 10px;
  background: #f0f4f8;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 12px;
  color: #0a66c2;
  text-decoration: none;
  transition: background 0.15s;
}

.media-link:hover {
  background: #e1e8ee;
}

/* Skills section */
.skills-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-category h3 {
  font-size: 15px;
  font-weight: 600;
  color: #191919;
  margin-bottom: 8px;
}

/* Languages */
.languages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Recommendations */
.recommendations-heading {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.recommendations-link {
  font-size: 13px;
  font-weight: 400;
  color: #0a66c2;
  text-decoration: none;
  margin-left: auto;
}

.recommendations-link:hover {
  text-decoration: underline;
}

.recommendation-photo {
  border-radius: 50%;
}

.recommendation-relationship {
  font-style: italic;
}

.entry-title a {
  color: inherit;
  text-decoration: none;
}

.entry-title a:hover {
  color: #0a66c2;
  text-decoration: underline;
}

.language-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8f8f8;
  border-radius: 6px;
  font-size: 14px;
}
.language-name {
  font-weight: 600;
}
.language-fluency {
  color: #666;
}

/* Print */
@media print {
  body {
    background: #fff;
  }
  .container {
    padding: 0;
    gap: 4px;
  }
  .card {
    border: none;
    box-shadow: none;
    padding: 16px 0;
  }
  .card h2 {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .pill {
    border: 1px solid #ccc;
  }
  .entry {
    padding: 8px 0;
    break-inside: avoid;
  }
  a {
    color: inherit;
  }
  h2 {
    break-after: avoid;
  }
  .skills-sections {
    break-inside: avoid;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 8px;
    gap: 6px;
  }
  .card {
    padding: 16px;
  }
  .profile-photo {
    width: 96px;
    height: 96px;
    margin-top: -48px;
  }
  .profile-info h1 {
    font-size: 20px;
  }
  .logo-placeholder {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  .entry-logo-img {
    width: 40px;
    height: 40px;
  }
}
`
