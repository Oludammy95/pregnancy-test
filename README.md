# Pregnancy Risk Assessment Application

A Next.js application for assessing pregnancy risks using AI models for Ectopic and Molar pregnancy prediction.

## Features

- **Ectopic Pregnancy Risk Assessment**: Comprehensive evaluation based on patient demographics, history, symptoms, lab tests, and ultrasound findings
- **Molar Pregnancy Risk Assessment**: Detailed assessment including clinical symptoms, laboratory data, and imaging results
- **Responsive Design**: Built with Tailwind CSS for optimal viewing on all devices
- **Component-Based Architecture**: Modular, reusable components for easy maintenance
- **Form Validation**: Built-in validation for required fields and data types
- **Real-time Results**: Instant risk assessment with recommendations

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Icons**: Heroicons
- **Styling**: Tailwind CSS with custom gradients and animations

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── pages/
│   ├── _app.js          # App wrapper
│   ├── index.js         # Home page
│   ├── ectopic.js       # Ectopic pregnancy assessment
│   └── molar.js         # Molar pregnancy assessment
├── components/
│   ├── Layout.js        # Main layout component
│   ├── FormInput.js     # Reusable form input component
│   └── FormSection.js   # Form section wrapper
├── styles/
│   └── globals.css      # Global styles and Tailwind imports
└── public/              # Static assets
```

## Components

### Layout

- Responsive navigation with mobile menu
- Gradient backgrounds and professional styling
- Footer with medical disclaimer

### FormInput

- Supports multiple input types (text, number, radio, select)
- Built-in validation and error handling
- Consistent styling across all form elements

### FormSection

- Organized form sections with icons
- Responsive grid layout
- Clear visual hierarchy

## API Integration Ready

The application is structured to easily integrate with AI prediction APIs:

- Form data is collected and formatted for API calls
- Loading states and error handling are implemented
- Results display component is ready for real prediction data

## Medical Disclaimer

This application is designed for educational and informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

## License

This project is for educational purposes
