# Freezer Inventory Manager

A lightweight, automated tool to keep track of your freezer contents without having to write dates on every single bag or container.

## Why this project?
I’ve always found it tedious to label every frozen item with a date. Instead of turning my freezer management into a chore, I chose a simpler path:
1. I put the item in the freezer.
2. I add the item and its expiration date to my [Google Sheet](https://docs.google.com/spreadsheets/d/1llPgHkNjkhm_Z8hcYNVFVseVN_o0Vw24M4996GuxE6c/edit?usp=sharing).
3. This script does the rest automatically.

## How it works
This script uses Google Apps Script to:
- Scan your spreadsheet every week.
- Identify expired items that need to be tossed.
- Highlight items that need to be eaten soon (within the next 60 days).
- Send a summary email every Friday at 7:00 PM.

## Setup Instructions

1. **Prepare your Sheet:** Ensure your spreadsheet has at least two columns: one for the Item Name and one for the Expiration Date.
2. **Access Apps Script:** In your Google Sheet, go to **Extensions > Apps Script**.
3. **Copy Code:** Replace the existing code with the content of `Code.gs`.
4. **Configure:** Modify the `Configuration Constants` at the top of the script:
   - `SHEET_NAME`: The name of the tab where your data is stored.
   - `NOTIFICATION_EMAILS`: A list of emails to notify.
   - `ALERT_THRESHOLD_DAYS`: Number of days in advance to get notified.
   - `TRIGGER_DAY_OF_WEEK`: The day to receive the email (e.g., `ScriptApp.WeekDay.FRIDAY`).
   - `TRIGGER_HOUR`: The hour of the day (0-23) to trigger the script.
   - `COL_ITEM_NAME` & `COL_EXPIRATION_DATE`: Column indexes (e.g., Column A = 0).
5. **Initialize:** Run the `setupTrigger` function once from the editor to grant permissions and schedule the weekly email.
6. **Test:** Set `TEST_MODE = true` initially to check the `Execution Log` before switching to `false` for live emails.

## Disclaimer
This is a minimalist utility script. Feel free to fork and adapt it to your specific kitchen needs!
