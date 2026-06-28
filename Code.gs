/**
 * Configuration Constants
 */
const SHEET_NAME = "Congélation"; // The name of the tab in your sheet where the freezer data is stored
const NOTIFICATION_EMAILS = ["your-email@example.com"]; // Array of email addresses that will receive the notification
const TEST_MODE = true; // If true, the summary will be logged in the execution console instead of sent by email

// Timing configuration
const ALERT_THRESHOLD_DAYS = 60; // How many days in advance to notify about items expiring
const TRIGGER_DAY_OF_WEEK = ScriptApp.WeekDay.FRIDAY; // The day of the week the script should run - Choose: MONDAY, TUESDAY, etc.
const TRIGGER_HOUR = 19; // The hour of the day (0-23) the script should run - Hour in 24h format (e.g., 19 for 7 PM)

// Column Indexes (0-based: Column A = 0, Column B = 1, etc.)
const COL_ITEM_NAME = 0; // The column containing the food item name
const COL_EXPIRATION_DATE = 6; // The column containing the expiration date

function setupTrigger() {
  const triggerName = "eatSoonCheck";
  const existingTriggers = ScriptApp.getProjectTriggers();
  const triggerExists = existingTriggers.some(trigger => trigger.getHandlerFunction() === triggerName);

  if (!triggerExists) {
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .onWeekDay(TRIGGER_DAY_OF_WEEK)
      .atHour(TRIGGER_HOUR)
      .create();
    Logger.log("Trigger created: weekly execution on " + TRIGGER_DAY_OF_WEEK + " at " + TRIGGER_HOUR + ":00.");
  } else {
    Logger.log("Trigger already exists.");
  }
}

function eatSoonCheck() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Attempt to get by name, fallback to first sheet if not found
  const sheet = ss.getSheetByName(SHEET_NAME) ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  const data = sheet.getDataRange().getValues().slice(1);
  
  const today = new Date();
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() + ALERT_THRESHOLD_DAYS);

  // Filter expired items (date < today)
  const expiredList = data.filter(row => {
    const pDate = new Date(row[COL_EXPIRATION_DATE]);
    return pDate instanceof Date && !isNaN(pDate) && row[COL_EXPIRATION_DATE] !== "" && pDate < today;
  });

  // Filter items to eat soon (today <= date < 60 days from now)
  const toEatList = data.filter(row => {
    const pDate = new Date(row[COL_EXPIRATION_DATE]);
    return pDate instanceof Date && !isNaN(pDate) && row[COL_EXPIRATION_DATE] !== "" && pDate >= today && pDate < limitDate;
  });

  if (expiredList.length === 0 && toEatList.length === 0) return;

  let bodyPrepList = `Hello,\n\nHere is the status of your freezer contents:`;

  if (expiredList.length > 0) {
    bodyPrepList += `\n\n[!!!] EXPIRED ITEMS (TO THROW AWAY):`;
    expiredList.forEach(row => {
      const date = Utilities.formatDate(new Date(row[COL_EXPIRATION_DATE]), Session.getScriptTimeZone(), "dd/MM/yyyy");
      bodyPrepList += `\n    - ${row[COL_ITEM_NAME]} (expired on ${date})`;
    });
  }

  if (toEatList.length > 0) {
    bodyPrepList += `\n\nTO EAT SOON:`;
    toEatList.forEach(row => {
      const date = Utilities.formatDate(new Date(row[COL_EXPIRATION_DATE]), Session.getScriptTimeZone(), "dd/MM/yyyy");
      bodyPrepList += `\n    - ${row[COL_ITEM_NAME]} (consume before ${date})`;
    });
  }

  if (TEST_MODE) {
    Logger.log(bodyPrepList);
  } else {
    MailApp.sendEmail(NOTIFICATION_EMAILS.join(", "), "Freezer Inventory Alert", bodyPrepList);
  }
}
