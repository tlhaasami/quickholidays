# Quick Holidays — Phase 4 Pages & Tools Design Plan

This plan documents the layout, functionality, copy, and styling for the three upcoming pages (Task 10, Task 12, Task 13).

---

## 1. Task 10: Pricing Page Redesign (`/pricing`)

### Layout & Tiers
We will modify `src/app/pricing/page.tsx` to display three options side-by-side:

| Tier | Price | Payment Model | Key Features Included |
| :--- | :--- | :--- | :--- |
| **Documentation Templates** | **£45** | Single payment | Custom checklists, professional cover letter templates, and travel insurance guidelines. You compile and submit everything yourself. |
| **Custom Documentation Audit** | **£95** | Single payment | Standard documentation check: we audit your bank statements, employer letter, and drafts, and compile your custom cover letter. |
| **Complete Schengen Visa Service** | **£175** | **£45 case deposit** + £130 balance when appointment slot is secured | End-to-end management: document audit, visa form completion, cover letter compilation, slot tracking & booking at VFS/TLS, and tracking to decision day. |

### External Fee Transparency Card
A distinct box below the pricing grid explaining third-party fees that **never** go to Quick Holidays:
*   **Embassy Visa Fee**: Set by EU regulation. €90 (approx. £78) for adults, €45 (approx. £39) for children aged 6-12, free for children under 6. Paid at the appointment center.
*   **Outsourcing Booking Fee**: Paid directly to VFS Global or TLScontact during appointment booking. Typically £30 to £45.

---

## 2. Task 12: "Are you Schengen Ready?" Tool (`/schengen-ready`)

A highly interactive, step-by-step React form to give users a free, instant eligibility check before booking.

### Questionnaire Flow (8 Steps)
1.  **UK Visa Type**: BRP (Skilled Worker, Spouse, ILR), Student (Tier 4), Tourist, Short-term visitor.
2.  **UK Visa Validity**: When does your BRP/visa expire? (Inputs: Date picker. Must be 3+ months past exit date).
3.  **Passport Validity**: When was your passport issued, and when does it expire? (Must be issued within 10 years and valid for 3+ months past exit date).
4.  **Proof of Funds**: Average balance in personal UK bank account over the last 3 months. (options: Under £500, £500-£1500, £1500-£3000, Over £3000).
5.  **Employment Status**: Employed (F/T or P/T), Self-employed, Student, Dependent (sponsored by spouse/parent), Unemployed.
6.  **Intended Destination**: Where are you travelling? (France, Spain, Germany, Italy, etc. Rules: longest stay governs jurisdiction).
7.  **Prior Refusals**: Have you been refused a Schengen visa in the last 2 years? (Yes / No).
8.  **Trip Duration**: How many nights do you plan to travel? (Inputs: Number).

### Verdict Engine Logic
*   **Not Ready (Red Verdict)**:
    *   Trigger: UK Tourist visa, or BRP validity less than 3 months from travel end date, or passport over 10 years old, or balance under £500.
    *   Verdict text: *"Not ready yet. Applying now would lead to a near-certain embassy refusal. Here is what to fix: [List of specific failures]."*
*   **Ready with Fixes (Yellow Verdict)**:
    *   Trigger: Prior refusal (needs a rebuttal cover letter), or bank balance between £500-£1500 (needs a sponsor or solid bank statements build-up), or self-employed (needs SA302/UTR tax records).
    *   Verdict text: *"Ready with fixes. You can apply, but you need to prepare specific documents to satisfy the embassy: [List of required adjustments]."*
*   **Schengen Ready (Green Verdict)**:
    *   Trigger: BRP valid for 3+ months, passport compliant, balance over £1500, standard employment or student registry letters, no recent unaddressed refusals.
    *   Verdict text: *"You are Schengen Ready! Your profile meets the strict embassy criteria. You can proceed with booking your VFS or TLS appointment."*

---

## 3. Task 13: "Refused Before?" Guide Page (`/refused-before`)

An educational resource addressing applicants who have suffered a visa refusal, outlining how to prepare a compliant reapplication.

### Content Structure
1.  **Decode the Rejection Reason**: Explain common codes checked on the standard EU refusal letter:
    *   *Reason 2*: "Justification for the purpose and conditions of the intended stay was not provided." (Often caused by generic cover letters, mismatching hotel/flight dates, or weak travel itineraries).
    *   *Reason 3*: "You have not provided proof of sufficient means of subsistence." (Caused by low personal bank balances, sudden unexplained lump deposits, or missing bank statements).
    *   *Reason 8*: "The information submitted regarding the justification for the purpose and conditions of the intended stay was not reliable." (Usually relates to suspicious hotel reservations or dummy flight bookings).
2.  **Our Reapplication Strategy**:
    *   **Custom Rebuttal Letter**: A professional cover letter addressing the exact refusal code with counter-proof.
    *   **Real Bookings Audit**: Advise on how to handle refundable flights and free-cancellation hotels instead of dummy reservations.
    *   **Sponsorship Documentation**: Clarify sponsor rules if funds were the refusal cause.
3.  **Call to Action**: Links to the `/schengen-ready` tool and a prominent button to book a consultation.
