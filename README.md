# Toy Deletion Mechanism

## Changes Made
1. Updated foreign key constraints to cascade deletes.
2. Added validation checks for active rentals.
3. Implemented comprehensive logging in `toy_deletion_logs`.
4. Set up monitoring for failed deletions.

## Maintenance Instructions
- Regularly monitor the `toy_deletion_logs` table.
- Investigate and resolve any failed deletions promptly.
- Test the deletion flow after database schema changes.
