# Fresha partner application: feature analysis for Miznora

Reviewed on **2 November 2026**, using the signed-in Fresha partner account open in **Brave**. The account's business country is Oman and its currency is OMR. This is a product and workflow review, not an implementation, performance, security, or regulatory audit.

## 1. Main conclusion

Fresha combines salon operations, customer acquisition, retail sales, customer engagement, workforce management, and analytics. A comparable product is substantially larger than an appointment calendar with a POS screen.

For Miznora, build the operational workflow first: **configure services and staff → establish availability → book → serve → check out → reconcile and report**. Add acquisition channels, advanced customer engagement, and workforce compensation in subsequent releases.

Miznora currently contains planning and brand assets; the features below are a reference for future development, not implemented Miznora capabilities.

## 2. Evidence and review boundaries

| Label | Meaning |
|---|---|
| **Reviewed** | An actual screen, existing profile, configuration page, or unsaved form was inspected. This confirms visible fields and controls, not the correctness of every operation. |
| **Overview** | Fresha displayed an introduction, setup prompt, or add-on description. The capability is advertised in the account; its full workflow was not exercised. |
| **Navigation** | A menu entry or related screen link was visible; its detailed workflow was not inspected. |
| **Proposed** | A Miznora design recommendation, not a verified fact about Fresha. |

The review covered the major navigation areas and representative workflows. It did not activate subscriptions or add-ons, publish a marketplace profile, connect external accounts, send messages, complete purchases, or save business configuration changes. An appointment inspection draft was exited without saving. The POS introduction was closed; the subsequent draft-sales screen showed **no draft sales**. Brave was returned to the dashboard.

Account contact information, client details, internal record identifiers, and conversation contents are intentionally excluded from this report. Authenticated source links below may require the user's account to view.

## 3. Feature overview

| Area | Principal capabilities found | Evidence |
|---|---|---|
| Dashboard | Sales and appointment summaries, activity, upcoming appointments, top services and team members | Reviewed |
| Calendar and appointments | Staff scheduling, service selection, walk-ins, multi-service bookings, availability, waitlist entry point | Reviewed; waitlist workflow not exercised |
| Services | Categories, pricing, durations, team assignments, resources, add-ons, forms, commissions and online-booking settings | Reviewed form and section navigation |
| CRM | Client directory, imports, profiles, histories, wallet, records, loyalty and reviews | Reviewed directory and profile; some tabs only observed |
| Segmentation | Standard and custom automated customer audiences | Reviewed |
| POS and sales | Sale history, draft sales, daily summaries, checkout entry point, tips and payment stages | Reviewed lists; checkout blocked by introduction/setup screen |
| Registers | Daily opening and closing, cash movements, petty cash and floats | Overview |
| Inventory | Products, categories, brands, bulk import, low-stock reminders, stocktakes, stock orders and suppliers | Overview plus stock-order prerequisite screen; suppliers navigation |
| Packages and memberships | Bundled benefits, redemption limits, memberships and benefit-consumption reporting | Package overview; membership links and report entries |
| Online booking | Marketplace, Google, Facebook/Instagram, direct links, QR codes, business website | Reviewed settings and direct links; other channels overview/navigation |
| Marketing | Campaigns, automated messages, deals, smart pricing, message history | Automations reviewed; campaigns/deals overview; smart pricing described in settings |
| Loyalty and reputation | Points, tiers, referrals, reward redemption, Fresha/Google reviews, AI reply entry point | Loyalty overview; reputation screen reviewed |
| Team | Staff profiles, role labels, weekly shifts, performance, wages, commissions, timesheets and pay runs | Reviewed profiles/roster/pay settings; payroll overview |
| Reports | 59 listed reports, standard/premium separation, dashboards, custom reports, filtering and export | Reviewed catalogue and one detailed report |
| Messaging | Shared client inbox, open/closed conversations, search, quick replies, attachments and team messaging entry point | Reviewed demo inbox; no messages sent |
| Workspace administration | Business/localization, locations, booking rules, taxes, receipts, forms, billing and payment settings | Reviewed representative settings; billing/payment processing not deeply tested |
| Extensions | Accounting integrations, analytics/ads integrations, data connector, AI Concierge and other add-ons | Catalogue descriptions reviewed; integrations not connected |

## 4. Detailed operational features

### 4.1 Dashboard

Source: [Partner dashboard](https://partners.fresha.com/dashboard).

- Recent sales with a time window, filters, and chart comparing sales with appointments.
- Appointment count and appointment value shown separately from completed sales.
- Upcoming appointments summary with its own time window and filters.
- Appointment activity feed linking to appointment details.
- Today's next appointments.
- Top services comparing this month with last month.
- Top team member sales comparison.
- Global search, performance insights, notifications, setup progress and Connect entry points.

**Implication for Miznora:** booked value and collected revenue are different metrics and must remain separately defined.

### 4.2 Calendar and appointment creation

Sources: [Calendar](https://partners.fresha.com/calendar), [Scheduling settings](https://partners.fresha.com/setup/scheduling).

Reviewed controls and form fields:

- Today shortcut and date navigation.
- Day-view selector; other calendar view types were not verified.
- Scheduled-team selector, visibility filters and reset-to-default view.
- Staff columns, appointment time ranges, client names and service labels.
- Calendar settings and waitlist drawer entry points.
- Add menu: appointment, blocked time, sale and quick payment.
- Booking begins by choosing a time or viewing available times.
- Service search and category grouping with duration and OMR price.
- Client selection is optional for walk-ins.
- Add multiple services to an appointment.
- Edit or remove a service in an unsaved appointment.
- Any-team-member selection for a service.
- Running total and amount to pay.
- Services and Time stages in the creation flow.

Scheduling configuration:

- Time zone, 12/24-hour format and first day of week.
- Calendar color source; display of processing time and blocked time.
- Waitlist appointment settings, blocked-time types, resources, cancellation reasons and closed periods.
- Appointment lifecycle: **Booked, Confirmed, Arrived, Started, Completed, Canceled, No-show**.
- Custom-status creation is offered; some core statuses are locked.
- Online booking window and cancellation/rescheduling window.
- Appointment time increments and gap-reduction/schedule optimization preferences.
- Dynamic staff assignment settings entry point.

The account displayed Muscat time, a Saturday week start, and a 15-minute online-booking increment. These are account settings, not universal defaults.

**Still unverified:** recurring appointments, drag-to-reschedule behavior, conflict handling, simultaneous resource requirements, overbooking rules and concurrent booking behavior.

### 4.3 Service catalogue

Source: [Service menu](https://partners.fresha.com/catalogue/services).

- Service categories, category counts, search, filtering and ordering.
- Draggable service entries and category/service action menus.
- Service name, description, treatment type and customer-facing category.
- Price type selector, price, duration and extra time.
- AI description-generation control.
- Team-member assignment section.
- Resources and service add-ons sections.
- Online-booking configuration, portfolio images and forms sections.
- Commissions and additional service settings sections.

The treatment type is described as helping customers discover services in the marketplace. Detailed option lists inside each section were not all opened.

### 4.4 CRM and client profiles

Sources: [Clients](https://partners.fresha.com/clients/list), [Client segments](https://partners.fresha.com/clients/segments).

Directory:

- Add clients and import an existing client list.
- Search by name, email or phone.
- Filtering, sorting, row selection and directory options.
- Name, mobile number, reviews, sales and creation-date columns.

Profile:

- Overview, Appointments, Sales, Client details, Items, Records, Wallet, Loyalty and Reviews sections.
- Book-now action and profile actions menu.
- Birthday and pronoun fields.
- Wallet balance representing gift cards and prepayments.
- Total sales, appointment count, rating, cancellations and no-shows.

Segmentation:

- Standard and custom segments, search, creation and segment action controls.
- Automated audiences usable in marketing, reports and the calendar.
- Visible examples: new clients, recent clients, first visit, loyal clients, lapsed clients, high spenders, upcoming birthdays, online bookers, future appointments, clients with sales and imported clients.

**Implication for Miznora:** segmentation should derive from appointment and sale events rather than duplicate manually maintained customer lists.

### 4.5 Sales, checkout and daily reconciliation

Sources: [Sales](https://partners.fresha.com/sales/sales-list), [Daily sales](https://partners.fresha.com/sales/daily-sales), [Registers](https://partners.fresha.com/sales/register).

Reviewed operational screens:

- Sales history and separate draft-sales tab.
- Search by sale/client or draft ID, date filters, additional filters, sorting and options.
- Daily transaction summary showing sales/refund quantities and gross totals by item type.
- Daily item types include services, service add-ons, products, shipping, gift cards, packages, memberships, cancellation fees and no-show fees.
- Cash-movement summary separating collected payments, refunds, gift-card redemptions and tips.
- Export and add-new controls.
- Payment-transactions list and sold gift cards/packages/memberships in navigation.

Checkout boundary:

- Opening a new sale displayed a POS introduction requiring **Start now**. It was not activated.
- The accessibility tree also exposed an empty cart, optional client, appointment/service/product/package/gift-card categories, search, quick-sale selection and **Cart → Tip → Payment** stage labels.
- Those labels describe the exposed checkout structure; a complete interactive payment flow was **not verified**.
- POS introduction advertises service, product, membership and gift-card sales, tips, and reconciliation reports.
- Register introduction advertises opening/closing, cash movement, petty cash and float management.

**Still unverified:** split tender, partial payments, deposits, card authorization, refunds, voids, receipt delivery and payment-provider availability in Oman. Refund and fee categories in reports do not prove all related operational workflows were tested.

### 4.6 Inventory and packages

Sources: [Products](https://partners.fresha.com/catalogue/products), [Stocktakes](https://partners.fresha.com/catalogue/stocktakes), [Stock orders](https://partners.fresha.com/catalogue/orders), [Packages](https://partners.fresha.com/catalogue/packages).

Product introduction describes:

- Single-product creation and bulk import.
- Product brands and categories.
- Low-stock reminders.
- Online retail sales and product sales at checkout.

Stocktake introduction describes:

- Barcode-scanner counting.
- Pause/resume of stocktakes.
- Inventory updates on completion.
- Stocktake notes.

Stock orders had an actual empty screen requiring products before creating orders. Suppliers was present in navigation. Ordering, receipt of stock, and supplier editing were not exercised.

Package introduction describes bundling services, products and discounts, online upselling, benefit redemption and limits. Membership sale lists and membership-consumption reports were present, but recurring billing and membership lifecycle rules were not tested.

### 4.7 Online booking and distribution

Sources: [Marketplace](https://partners.fresha.com/fresha/online-booking/locations), [Direct links](https://partners.fresha.com/fresha/online-booking/buttons-and-links), [Booking options](https://partners.fresha.com/setup/scheduling/booking-options).

- Marketplace listing and customer self-booking.
- Reserve with Google; Facebook and Instagram booking channels.
- Standard link to book or buy any item and link to book appointments across locations.
- Custom booking/purchase links, search and filtering.
- QR codes described in workspace settings.
- Smart Website offering.
- Staff profiles, portfolio images, star ratings and specific-staff selection in customer booking settings.
- Service images, featured services and service-name display in reviews.
- Multi-person booking option.
- Service/membership upselling and important pre-booking information.
- Team email notifications for online bookings, reschedules and cancellations.

The marketplace profile was unpublished and online bookings were not enabled in this account. No public booking was completed and no profile was published. External channel integrations were not connected.

### 4.8 Marketing and communications

Sources: [Automations](https://partners.fresha.com/marketing/automated-messages), [Campaigns](https://partners.fresha.com/marketing/blast-campaigns/home), [Deals](https://partners.fresha.com/marketing/deals).

Reviewed automated-message categories and templates:

| Category | Visible templates |
|---|---|
| Reminders | Three days, 24 hours and one hour before an appointment |
| Appointment changes | New booking, reschedule, cancellation, no-show and post-checkout thank-you/review request |
| Waitlist | Joined waitlist and a time slot becoming available |
| Retention | Rebooking reminder, birthday, lapsed-client win-back and loyal-client reward |
| Milestones | New-client welcome and create-new entry point |
| Client messages | New chat message and contact-page message received |
| Loyalty | Points summary, tier achievement, rewards summary and referral rewards |

Some templates were enabled and others offered an Enable action. No toggle was changed and no message was sent.

Other findings:

- Communication balance and automatic-top-up setup controls.
- Blast campaign introduction advertises email/text campaigns, customizable messages and campaign reporting.
- Deals introduction advertises discount codes, flash sales, last-minute offers and performance tracking.
- Smart pricing is described as changing prices during busier or quieter hours.
- Message history is described as including email, text and push messages.

**Not verified:** WhatsApp support. Miznora's proposed WhatsApp integration remains its own requirement and needs separate provider evaluation.

### 4.9 Loyalty, reviews and messaging

Sources: [Loyalty](https://partners.fresha.com/clients/loyalty), [Online reputation](https://partners.fresha.com/clients/online-reputation), [Connect](https://partners.fresha.com/connect).

- Loyalty is presented as an add-on with points, tiers, referrals, exclusive rewards and online progress/redemption.
- Reputation dashboard covers Fresha and Google reviews, overall rating, review count, response rate and rating distribution.
- All-reviews and Reply-with-AI tabs.
- Google account connection prompt; not connected during review.
- Google Rating Boost is described in add-ons.
- Client Connect provides a shared two-way inbox on web/app.
- Demo inbox exposed search, open/closed conversations, new-message control, attachments, emoji and quick replies.
- Team Connect entry point and team messaging add-on.
- Public contact-page inquiry messaging described in Connect's introduction.

Inbox interaction was limited to viewing the demo conversation and controls. Reply/attachment controls in that demo were disabled until contact details were supplied; none were supplied.

### 4.10 Team and compensation

Sources: [Team members](https://partners.fresha.com/team/team-members), [Shifts](https://partners.fresha.com/team/scheduled-shifts), [Pay runs](https://partners.fresha.com/team/payrun/overview).

- Team directory with search, filters, custom ordering, contact information and permission-role labels.
- Staff profile sections: Overview, Personal, Workspace and Pay.
- Staff performance measures: sales, appointments, clients, occupancy and retention, with prior-period comparisons.
- Weekly roster, date navigation and scheduled-time totals.
- Roster text explicitly distinguishes staff booking availability from standard business opening hours.
- Pay settings show wages/timesheets, commissions, payment preference and cash-advance configuration.
- Timesheets entry point.
- Pay-run overview describes combining wages, commissions and tips, adjusting bonuses, and sharing earning reports.
- Team setup describes permissions, compensation and time-off management.

No access permissions, wages, commission rules, shifts or pay runs were changed. Access enforcement and payroll calculations were not tested.

### 4.11 Workspace settings and localization

Sources: [Workspace settings](https://partners.fresha.com/setup), [Business details](https://partners.fresha.com/setup/business-setup/business-details), [Sales settings](https://partners.fresha.com/setup/sales), [Forms](https://partners.fresha.com/setup/forms-and-notes/form-templates).

- Business name, country, currency, tax-calculation preference and separate team/client default languages.
- External website and social links.
- Multiple-location management, location contact/business details, business types, location/address, opening hours and location sales settings.
- Sales settings: taxes, receipts, registers, tipping, service charges, gift cards and custom checkout methods.
- Tax defaults can automatically apply to appointments and sales; the inspected account had no configured tax rates.
- The business-level setting showed retail prices including tax.
- Cash and a custom Other payment method were shown as active.
- Receipt client-information visibility, title, custom header lines and footer.
- Receipt sequencing across locations.
- Client sources and tags described in settings.
- Form templates attachable to clients and appointments; forms-library entry point.
- Billing section for provider invoices, communication usage, add-ons and billing.
- Payment settings for methods, terminals and payment policy.

Daily sales and staff reports displayed OMR values to three decimal places. Arabic/RTL availability and detailed language choices were **not verified**. Current English defaults do not establish which languages Fresha supports.

### 4.12 Extensions and integrations

Source: [Add-ons and integrations](https://partners.fresha.com/add-ons).

Catalogue entries observed:

- Payments, Premium Support and Insights/custom reports.
- Google Rating Boost and Client Loyalty.
- Data Connector for external spreadsheets and systems.
- AI Concierge, labeled Beta, described as handling bookings, questions, messages and reviews.
- Client Connect and Team Connect.
- Smart Website and Bookable Resources for rooms/equipment and usage reporting.
- Xero and QuickBooks accounting integrations.
- Facebook/Instagram bookings, Meta Pixel, Google Analytics and Google Ads conversion tracking.

These are catalogue offerings, not proof that every integration is enabled or supported for every market/account. No API keys, OAuth connections or subscriptions were created.

## 5. Reporting catalogue

Source: [Reports](https://partners.fresha.com/reports).

The inspected account listed **59 reports**, with **51 Standard** and **8 Premium**, and a Dashboards category containing three dashboards. This is the account's observed catalogue count on the review date, not a permanent universal count.

Catalogue controls include search, creator filtering, category tabs, sorting, favourites, folders, custom reports and a Data Connector entry point.

An actual Sales summary report was opened. It supports date selection, grouping/type selection, filters, advanced filters, customization, named views and **CSV, Excel and PDF** export. Visible columns included sales quantity, items sold, gross sales, discounts, refunds, net sales, taxes and total sales. It displayed a data-freshness timestamp; do not assume all reporting is real-time.

### Dashboard and general performance entries — 5

1. Performance dashboard
2. Online presence dashboard
3. Loyalty dashboard
4. Performance summary
5. Performance over time

### Sales — 15

1. Sales summary
2. Sales by time period
3. Sales list
4. Sales log detail
5. Gift card by time period
6. Gift card list
7. Memberships list
8. Memberships summary
9. Memberships benefits consumption
10. Packages list
11. Packages summary
12. Packages benefits consumption
13. Cash register summary
14. Discount summary
15. Taxes summary

### Finance — 11

1. Finance summary
2. Payments summary
3. Payment transactions
4. Cash flow summary
5. Cash flow statement
6. Service charges
7. Liability summary
8. Liability activity
9. Prepayments by time period
10. Prepayment list
11. Taxes list

### Appointments — 5

1. Appointments summary
2. Appointments list
3. Appointments cancellations & no-show summary
4. Waitlist detail
5. Waitlist summary

### Team — 15

1. Working hours activity
2. Break activity
3. Attendance summary
4. Wages detail
5. Wages summary
6. Fee deduction activity
7. Fee deduction summary
8. Pay summary
9. Scheduled shifts
10. Working hours summary
11. Team time off report
12. Tips summary
13. Tips detail
14. Commission activity
15. Commission summary

### Clients — 3

1. Client summary
2. Client list
3. Client insights

### Inventory — 5

1. Stock on hand
2. Stock movement summary
3. Stock movement log
4. Product list
5. Ordered stock

These names were inspected in the catalogue. The underlying calculations, exports and access rules of all 59 reports were not individually exercised.

## 6. Proposed Miznora delivery sequence

This section is a product recommendation based on the review and Miznora's brand brief. It is not a description of Fresha's internal architecture.

| Release | Proposed scope | Completion target |
|---|---|---|
| Foundation | Business accounts/tenant isolation, staff access, permissions, locations, audit history, localization and money/time handling | Every request is scoped to the correct business and permitted role |
| Operational MVP | Service categories/pricing/durations, staff availability, client profiles, calendar, booking lifecycle, manual checkout, receipts, daily sales and basic reports | A pilot salon can complete an entire working day in the product |
| Booking and retention | Public booking page, confirmation/reminders, cancellation policies, waitlist, rebooking, packages and customer self-service | Customers can book and receive reliable updates |
| Retail and team operations | Products, stock ledger, low-stock alerts, suppliers/orders, commissions, timesheets and cash registers | Retail stock and staff earnings reconcile with sales |
| Growth and platform expansion | Memberships, loyalty, campaigns, advanced segmentation, accounting integrations, marketplace/discovery and advanced analytics | Additional channels and retention tools build on reliable operational data |
| Optional extensions | AI assistance, full website builder, payroll disbursement, sophisticated dynamic pricing and ad attribution | Separate products justified by actual operator demand |

Cross-cutting requirements for the Oman launch:

- English/Arabic interface and RTL layouts, including actual calendar and receipt testing.
- OMR three-decimal arithmetic, configured rounding and clear separation of sale, payment, refund, tip and stored-value amounts.
- Muscat time and configurable week start; store appointment instants and business time zones explicitly.
- Local phone normalization and bilingual business/customer records where required.
- Configurable taxes and receipt content. Applicable legal requirements need separate verification before implementation.
- Payment and messaging providers selected for Oman availability, costs and operational suitability; do not assume Fresha's providers can be reused.
- Multi-location-ready data boundaries, even if the pilot interface launches with one location.
- Tenant isolation, audit history, backup/restore, exports and monitoring from the foundation stage.

## 7. Proposed domain model and key dependencies

Suggested core entities:

`Business/Tenant`, `Location`, `User`, `StaffMember`, `Role`, `Permission`, `ServiceCategory`, `Service`, `ServiceVariant`, `StaffServiceAssignment`, `Shift`, `TimeOff`, `Resource`, `Client`, `Appointment`, `AppointmentService`, `StatusHistory`, `Sale`, `SaleLine`, `Payment`, `Refund`, `TaxRate`, `Receipt`, `Notification`, `ConsentRecord`, `AuditEvent`.

Later entities:

`Product`, `Supplier`, `StockMovement`, `StockOrder`, `Stocktake`, `Package`, `Membership`, `BenefitRedemption`, `GiftCard`, `WalletLedgerEntry`, `CommissionRule`, `CommissionEntry`, `Timesheet`, `RegisterSession`, `Campaign`, `ClientSegment`, `LoyaltyAccount`, `Reward`, `Conversation`, `IntegrationConnection`.

Important design implications:

1. Appointment status and payment status are independent. A booking is not collected revenue.
2. Store service price/duration and tax snapshots on appointment/sale lines so later catalogue changes do not rewrite history.
3. Calculate availability from staff shifts, time off, blocked time, service timing, resources and booking policies. Enforce conflicts when saving, not just in the UI.
4. Keep customer balances, stock changes and commissions as auditable entries rather than only editable totals.
5. Make notification delivery retryable and suppress duplicates when bookings change.
6. Record payment-provider events idempotently and reconcile them with sales. Do not mark a sale paid solely because a browser returned successfully.
7. Build dashboards from defined metrics and document freshness; avoid different screens silently counting different business events.

These are proposed implementation requirements; Fresha's actual database, backend stack and infrastructure cannot be determined from this UI review.

## 8. Decisions required before development

1. Primary pilot segment: salon, spa, barbershop, or a narrower combination.
2. Initial location/staff scale and whether multiple locations must be usable at launch.
3. Payment scope: recording manual payments versus integrated online/terminal collection.
4. Whether public booking, inventory, packages and commissions are launch requirements.
5. Cancellation, refund, commission, tax-rounding and receipt rules.
6. Preferred customer-message channels and provider budget.
7. Import requirements for clients, services, products, appointments and existing balances.
8. Staff permissions and which reports each role may access.
9. Customer records/forms required by pilot operators and retention/export expectations.
10. Subscription model, business onboarding, support and administrator workflows for Miznora itself.

## 9. Explicit remaining verification gaps

- End-to-end checkout, deposits, split/partial payments, refunds, voids and card processing.
- Customer-facing online booking and marketplace ranking/search behavior.
- Recurring booking, appointment drag/drop, conflict/overbooking handling and simultaneous bookings.
- Inventory receiving, stock adjustments, supplier operations and scanner hardware behavior.
- Membership renewal, cancellation, recurring collection and detailed benefit rules.
- Detailed commission and payroll formulas, approvals and disbursement.
- Complete form-builder field types, signing, delivery and retention.
- Provider billing/subscription lifecycle, full permission matrix and account security behavior.
- Actual integration APIs, rate limits, webhooks, authentication and geographic availability.
- Arabic/RTL capability in Fresha, accessibility conformance, offline behavior, scale and performance.

These gaps should be resolved through targeted, authorized tests or official product documentation when they become relevant. They do not prevent defining Miznora's initial operational MVP.
