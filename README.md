# ⚽🏆 World Cup 2026 Champion Predictor

An interactive web-based simulator and predictor for the **FIFA World Cup 2026** hosted across Canada, Mexico, and the United States. This platform allows football fans to experience, tweak, and simulate the entire tournament from the expanded 48-team group stages all the way to crowning the world champion!

🚀 **Live Demo:** [wc-champion2026.netlify.app](https://wc-champion2026.netlify.app/)

---

## 🌟 Features

* 🗺️ **New 48-Team Format:** Fully supports the official expanded structure consisting of 12 groups of 4 teams each.
* 🔮 **End-to-End Simulation:** Simulates all 104 matches, dynamically sorting group standings and calculating the best third-placed wildcard teams to fill out the Round of 32.
* 📈 **Algorithmic Match Engine:** Uses statistical parameters (such as form, team data, or ELO indicators) to accurately calculate match probabilities, goal scoring distributions, and knockout stage penalty shootouts.
* 🎯 **Custom Tracking:** Select a "Target Country" to track their specific statistical pathways, discovering their best/worst group scenarios and tournament bottlenecks over multi-run simulations.
* 📱 **Responsive Frontend:** Clean, mobile-friendly interface built for ultra-fast, single-click tournament simulations.

---

## 🛠️ Architecture & Tech Stack

* **Frontend Framework:** Vanilla JavaScript / HTML5 / Tailwind CSS (or React/Vite depending on your build)
* **Hosting & Deployment:** Netlify 🌐
* **Simulation Logic:** Probabilistic Poisson distribution / Goal expectation logic built natively in JavaScript for instant processing.

---

## 📂 Project Structure

```text
wc-2026-predictor/
│
├── src/
│   ├── assets/          # Flag icons, logos, and styling assets
│   ├── data/            # JSON files containing team stats, seeds, and official groups
│   └── js/              # Simulation engines (group tables, bracket generators, algorithms)
│
├── index.html           # Main dashboard interface
├── README.md            # Project documentation
└── package.json         # Build configurations and dependencies
```

🔧 Local Installation & Setup
Want to run the predictor locally or build on top of the simulation logic? Follow these simple steps:

1. Clone the Repository
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME

2. Install Dependencies
Bash
npm install
3. Run the Development Server
Bash
npm run dev
Open your browser and navigate to http://localhost:5173 (or the local port provided in your terminal).

4. Build for Production
To generate the static bundle optimization that pairs perfectly with Netlify's deployment engine:

Bash
npm run build
