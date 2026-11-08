# Local synthetic fixtures

`../seed.sql` and `fixture-manifest.json` define two invented businesses with three locations, owner/manager/receptionist/professional/finance roles, a member shared across two businesses, a non-member, an invitee, an unverified identity and a staff member without login. All email addresses use the reserved `.example.test` domain. The published fixture password is intentionally local-only; these are not production credentials. No mail is sent by seeding SQL.

Run through the explicitly local reset wrapper. The HTTP integration suite mutates these fixtures, so reset before rerunning it. The embedded pgTAP suite rolls back its changes. No appointments, clients, clinical records or later-phase workflow fixtures are claimed. The Pages demo continues to use independent in-memory fixtures and has no Auth client.
