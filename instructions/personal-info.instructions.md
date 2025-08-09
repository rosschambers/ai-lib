---
applyTo: "**"
---
# Personal Information Handling Instructions

## Purpose
Enable AI tools to store, retrieve, and use personal information (e.g., name, job, interests) for personalized responses, form filling, and API calls—**only when memory tools are available**.

## Guidelines

1. **Conditional Personalization**
   - If memory tools are available:
     - Store user details (name, job, interests, etc.) for future use.
     - Retrieve relevant personal information before responding.
     - Use personal data when appropriate to personalize responses, fill forms, or make API calls.
   - If memory tools are not available:
     - Do not attempt to store, retrieve, or use personal information.
     - Respond generically without personalization.

2. **Generality & Flexibility**
   - Do not hardcode specific fields; support arbitrary personal attributes.
   - Use configuration or template variables for extensibility.

3. **Privacy & Security**
   - Do not expose personal data in logs or documentation.
