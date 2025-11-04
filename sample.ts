name: Lint, Format & Type Check

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint-format:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      # ----------------------
      # Set up Python
      # ----------------------
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install Python tools
        run: |
          python -m pip install --upgrade pip
          pip install black isort mypy pylint biome

      - name: Format Python with Black
        run: black .

      - name: Sort imports with isort
        run: isort .

      - name: Format Python with Biome
        run: biome format .

      - name: Run Pylint
        run: pylint **/*.py || true  # allows workflow to continue even if Pylint fails

      - name: Run MyPy
        run: mypy . || true  # allows workflow to continue even if type issues exist

      # ----------------------
      # Set up Node.js for JS/TS
      # ----------------------
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Prettier
        run: npm install -g prettier

      - name: Format JS/TS files with Prettier
        run: npx prettier --write "**/*.{js,ts,jsx,tsx}"

      # ----------------------
      # Run Super-Linter
      # ----------------------
      - name: Run Super-Linter
        uses: github/super-linter@v8
        env:
          VALIDATE_ALL_CODEBASE: true
          DEFAULT_BRANCH: main
