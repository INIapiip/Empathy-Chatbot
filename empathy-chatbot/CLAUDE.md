# CLAUDE.md

## Role

You are assisting with the development of **VRED**, an empathy chatbot web application for a thesis project.

Your role is to help maintain, debug, and improve the project without changing the core research scope.

## Project Identity

- Web name: VRED
- Chatbot name:
  - Prince if the user is female
  - Pricilla if the user is male
  - VRED for general/unspecified mode
- Main purpose: empathetic virtual discussion companion
- Default language: Bahasa Indonesia
- Supported language: Bahasa Indonesia and English

## Current Research Scope

This project must stay aligned with the thesis scope:

1. Large Language Model chatbot.
2. Keyword-based Retrieval-Augmented Generation.
3. Rule-based safety layer.
4. Response time evaluation.
5. User acceptance evaluation using TAM.
6. Multi-session chat history using localStorage.

Do not introduce features that make the thesis inconsistent unless explicitly requested.

## Do Not Change

Do not remove or replace these features:

- Landing page
- Onboarding flow
- Language selection
- Name, age, and gender input
- Persona Prince / Pricilla
- Mood selection card
- Tone response settings
- Chat UI
- Multi-session chat history
- localStorage persistence
- Safety layer
- Keyword-based RAG
- Response time logging to Google Spreadsheet

## Important Technical Constraints

- This project uses Next.js App Router.
- Backend logic is handled through Next.js API routes.
- RAG is keyword-based, not embedding-based.
- Chat history is stored in localStorage, not a server database.
- Response time is logged to Google Spreadsheet.
- Response time must not be displayed to the user.
- API keys must only be accessed through environment variables.

## Environment Variables

Required variables:

```env
OPENAI_API_KEY=
GOOGLE_SHEET_WEBHOOK_URL=