# README.md

# ⚡ Transformer Dashboard App

A frontend take-home project built with Vue 3, TypeScript, SCSS, Chart.js and Pinia. This app visualizes transformer voltage readings and displays transformer details in a responsive UI.

---

## 📦 Tech Stack

- **Vue 3** + **Vite** + **TypeScript**
- **Pinia** (state management)
- **SCSS** (custom styling)
- **Chart.js** (voltage time series chart)
- **LocalStorage** (state persistence)
- **Docker** (optional containerization)

---

## 🚀 Getting Started (Locally)

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Open your browser
http://localhost:5173
```

---

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

---

## 🐳 Docker Instructions

### Build Docker Image

```bash
docker build -t transformer-dashboard .
```

### Run Docker Container

```bash
docker run -p 4173:4173 transformer-dashboard
```

Then visit: [http://localhost:4173](http://localhost:4173)

---

## 📁 Project Structure (Key Parts)

```
src/
  components/              # Vue components (Table + Chart)
  stores/                  # Pinia store for transformers
  styles/                  # SCSS stylesheets
  types/                   # TypeScript types
  router/                  # Vue Router config
  main.ts / App.vue        # Entry files
public/
  sampledata.json          # Transformer input data
```

---

## ✅ Features

- Searchable transformer table with region and health info
- Interactive chart with voltage readings by date
- Multi-transformer comparison with checkbox filters
- Persistent selections via localStorage
- Full SCSS-based styling

---

## 📌 Notes

- All data is loaded from a local JSON file for simplicity.
- Chart auto-destroys on component unmount to free memory.
- Fully responsive layout using minimal dependencies.

---

> Made with ❤️ for the Camlin frontend challenge.
