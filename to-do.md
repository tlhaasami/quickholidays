# Quick Holidays — Implementation TO-DO List

This list maps out the tasks required to implement the changes outlined in [philosophy.md](philosophy.md). The tasks are organized in a sequential, dependency-free order.

---

## Phase 1: Stop the Contradictions (Text & Copy Rewrites)

### Task 1: Rewrite the About Us page
*   **Objective**: Rewrite `/about-us` to replace generic corporate jargon with the personal story of the founder and transparent, verifiable details about the company registration.
*   **Target File**: [about-us/page.tsx](src/app/about-us/page.tsx)
*   **Details to Use**: 
    *   Headline: "We started this because we'd been through it."
    *   Story: Explain the founder's experience with a Schengen refusal/agent disappearance before starting the service.
    *   Sections: "What we do differently" (honesty first, written promises, Companies House lookup).
    *   Registered Company: Quick Holidays Ltd, company number 15948457, registered in England and Wales. Office 25 Innovation Park, Edge Lane, Liverpool L7 9NJ.
*   **Related Information Available**: Yes (Draft structure in `philosophy.md` Part 3).

### Task 2: Rewrite the Destination Selector Hub page
*   **Objective**: Rewrite `/schengen-visa` to align it with the honest voice of the company. Remove superlatives like "Fastest Process" and "Highest Visa Approval". Update flight and hotel description.
*   **Target File**: [schengen-visa/page.tsx](src/app/schengen-visa/page.tsx)
*   **Details to Use**:
    *   Four pillars rewrite: 
        1. "An honest verdict first" (tell if ready before spending anything).
        2. "One named consultant" (same person from consultation to passport).
        3. "Checklist in 24 hours" (built for nationality, visa type, situation).
        4. "We own our mistakes" (refund in full if refusal is our fault).
    *   Section heading change: Replace "QuickVisa Assurance Process" with "How it works".
*   **Related Information Available**: Yes (Draft in `philosophy.md` Part 3).

### Task 3: Align Flight/Hotel Descriptions Across the Site
*   **Objective**: Change references claiming that we "book" flights and hotels to clarify that we *advise* on refundable options, while the client books and pays directly (ensuring they retain control of their money).
*   **Target Files**:
    * [VerticalAccordion.tsx](src/components/VerticalAccordion.tsx) (Step 2 details)
    * [schengen-visa/[country]/page.tsx](src/app/schengen-visa/[country]/page.tsx)
    * [pricing/page.tsx](src/app/pricing/page.tsx)
    * [documents.ts](src/rag/documents.ts)
*   **Details to Use**: "We show you exactly which refundable flights and free-cancellation hotels satisfy the embassy... You book them yourself and pay the airline and hotel directly... If your visa is refused, you cancel and you're not out of pocket."
*   **Related Information Available**: Yes (Draft in `philosophy.md` Part 3).

---

## Phase 2: Put the Missing Philosophy on the Site (Core Value Props)

### Task 4: Add the "Honesty Promise" Block to the Homepage
*   **Objective**: Add a prominent section right under the hero explaining that we will tell users if they are not ready to apply, rather than taking their money blindly.
*   **Target File**: [Hero.tsx](src/components/Hero.tsx) (Homepage container)
*   **Details to Use**: 
    *   Heading: "We'll tell you if you're not ready."
    *   Body: "Most consultancies take your money and submit anyway. If your application is likely to be refused, we'll say so at the free consultation... Last quarter we advised [X]% of enquiries to wait or fix something first."
*   **Related Information Available**: Yes (Draft in `philosophy.md` Part 3).

### Task 5: Add Time-based Promises and £45 Entry Pricing to the Homepage
*   **Objective**: Inject our concrete timing guarantees and entry-level starting fee on the main landing page to build immediate expectation and trust.
*   **Target File**: [Hero.tsx](src/components/Hero.tsx)
*   **Details to Use**: 
    *   Pricing: Mention "From £45" in the hero subtitle block.
    *   Timelines: 
        *   "Your custom checklist in your inbox within 24 hours."
        *   "Appointment slot search begins within 48 hours."
*   **Related Information Available**: Yes (Draft in `philosophy.md` Part 3).

### Task 6: Add the Half-Fee Reapplication Clause to the Accountability Promise
*   **Objective**: Add the half-fee reapplication clause as a named trust builder under the Accountability Promise section.
*   **Target Files**:
    * [refund-policy/page.tsx](src/app/refund-policy/page.tsx)
    * [Hero.tsx](src/components/Hero.tsx)
    * [documents.ts](src/rag/documents.ts)
*   **Details to Use**: If a visa is refused by the embassy due to no fault of the applicant or consultancy (ordinary embassy discretion), we will compile and submit the reapplication for a flat **50% discount** (half-fee).
*   **Related Information Available**: Yes (Details in `philosophy.md` Part 1 §9).

---

## Phase 3: Fix the Proof (Trust assets & Verifications)

### Task 7: Update Stat Counters with Verifiable Data
*   **Objective**: Replace the zero and generic placeholders in the homepage stats section with concrete, honest numbers.
*   **Target File**: [Hero.tsx](src/components/Hero.tsx) (Animated counters block)
*   **Details to Use**:
    *   Experience: "Serving UK-based non-UK nationals since 2024" (aligned with the 2024 company incorporation date).
    *   Reviews: Replace "CLIENTS+" count with a specific review count: "245+ verified client reviews".
    *   Approval Rate: Update from 97% to the verified statistics.
*   **Related Information Available**: Yes.

### Task 8: Replace Homepage Testimonials with Real Reviews [COMPLETED]
*   **Objective**: Swap out generic homepage reviews with real, verifiable reviews referencing actual consultants from our client review data.
*   **Target File**: [Hero.tsx](src/components/Hero.tsx)
*   **Details to Use**: Use real names and quotes from [reviews.json](src/data/reviews.json), such as:
    *   *Natasha K.*: Refused previously, assisted by Nile until biometrics completion.
    *   *KJ Ldn*: Assisted by Anaya, appointment found in a week, visa granted.
    *   *Nadeeka W.*: Family Schengen visa support, Jenny praised for stress-free documentation.
*   **Related Information Available**: Yes (Exact quotes from `reviews.json` lines 11, 27, 51, 75, 83).

### Task 9: Add Trust Pilot and Google Review Source Badges
*   **Objective**: Add visual badges and outbound links to the reviews page to show where the reviews come from.
*   **Target File**: [reviews/page.tsx](src/app/reviews/page.tsx) & [Hero.tsx](src/components/Hero.tsx)
*   **Details to Use**: Visual indicators and/or badges displaying "245 Reviews", with a clear link to the official review profiles.
*   **Related Information Available**: Yes.

---

## Phase 4: Create Missing Pages & Tools

### Task 10: Build a Dedicated Pricing Page [COMPLETED]
*   **Objective**: Build a clean `/pricing` page displaying all service tiers side-by-side with clear pricing details.
*   **Target File**: [pricing/page.tsx](src/app/pricing/page.tsx) (Note: Currently exists, but needs refinement to lead with £45/£95/£175 structures).
*   **Details to Use**: 
    *   Lead with £45 Documentation starting price.
    *   Compare: Documentation Only (£95), Appointment Booking (£95), Complete Visa Service (£175).
    *   Explain external fees: Embassy Visa Fee (€90 adult / €45 child) paid directly to the embassy.
    *   Define deposit structure (e.g. £45 case deposit for complete visa, £130 balance after slot tracking).
*   **Related Information Available**: Yes (Draft in `philosophy.md` Part 2 §2).

### Task 11: Add the Team Grid Block [COMPLETED]
*   **Objective**: Display team photos/avatars with first names on `/about-us` to align the brand voice with the real support people named by clients.
*   **Target File**: [about-us/page.tsx](src/app/about-us/page.tsx)
*   **Details to Use**: Real first names from reviews: Sophia, Sarah, Anaya, Riya, Jenny, Nile, Emma, Lisa, etc.
*   **Related Information Available**: Yes (Names extracted from client reviews).

### Task 12: Build the "Are you Schengen Ready?" Self-Assessment Tool [COMPLETED]
*   **Objective**: Build an interactive step-by-step form tool allowing users to test if their passport, BRP validity, savings, and dates meet the criteria for a successful application.
*   **Target File**: [NEW] `src/app/schengen-ready/page.tsx`
*   **Details to Use**: 
    *   8–10 questions: UK visa type, validity remaining (must be 3+ months beyond exit), financial savings, previous refusals, employment status.
    *   Outputs an honest verdict: *Ready*, *Ready with fixes*, or *Not ready yet, here's what to fix*.
*   **Related Information Available**: Yes (Matrix in `philosophy.md` Part 2 §1).

### Task 13: Build the "Refused Before?" Dedicated Guide Page [COMPLETED]
*   **Objective**: Build a page targeting prior-refusal applicants with instructions on how to handle reapplications and resolve common refusal letters.
*   **Target File**: [NEW] `src/app/refused-before/page.tsx`
*   **Details to Use**: Explanation of common refusal codes (e.g., Article 32 regarding intentions to return, insufficient funds) and a link to the self-assessment tool.
*   **Related Information Available**: Yes.
