# Login, Registration & Dataset Management
## End-to-End Prompt Engineering Guide
### AI Dairy Farm Management System — Web Application
#### Version 3.0 | Pure Narrative Format | Zero Code

---

## TABLE OF CONTENTS

1. Login Page Prompts
2. Registration Page Prompts
3. Forgot Password and Account Recovery Prompts
4. Authentication and Session Security Prompts
5. Create New Dataset Prompts
6. Add New Dataset from New Application Prompts
7. Role-Based Access Control Prompts
8. Validation and Error Handling Prompts
9. UI and UX Design Specification Prompts
10. Database and API Design Prompts

---

## 1. LOGIN PAGE PROMPTS

---

### Prompt 1.1 — Login Page Layout and Visual Design

You are a senior product designer with twenty years of experience building enterprise SaaS platforms for the agriculture sector. Design the complete Login Page for the AI Dairy Farm Management System web application.

The page must use a split-screen layout. The left half displays a full-height background image of a green dairy farm with grazing cattle, the platform logo centered near the top, a short inspiring tagline below it, and three small feature highlight icons at the bottom of the left panel calling out the platform benefits such as AI Health Monitoring, Profit Optimization, and Smart Feeding.

The right half contains the login form card centered vertically on a light background. At the top of the card show the platform logo, a heading that says Welcome Back, and a subheading that says Sign in to your farm dashboard.

The form contains an Email Address input field, a Password input field with a show and hide toggle icon, a row with a Remember Me checkbox on the left and a Forgot Password link on the right, and a full-width Sign In to Dashboard button in the primary green color.

Below the button place an OR divider followed by a Continue with Google button and a Continue with Microsoft button, both full-width with their brand icons.

At the bottom of the form card show a line that says Do not have an account followed by a Register Now link. In the very bottom footer of the page show a language selector supporting English, Hindi, Kannada, Tamil, and Telugu.

Display a small SSL security badge and the text Your data is encrypted and secure near the bottom of the form card to build trust.

After three failed login attempts show a CAPTCHA challenge before allowing further attempts.

After a successful login redirect each user type to the correct section. Farm Owners go to the Farm Dashboard. Veterinarians go to the Health Monitoring Panel. Cooperative Officers go to the Procurement Dashboard. Admins go to the Admin Control Panel. First-time users go to the Onboarding Wizard.

On mobile devices collapse the left panel entirely and show only the form in a single full-width column layout.

Define the visual hierarchy, spacing, color usage, and interactive states for every element on this page. Describe what the page looks like in its default state, its loading state while credentials are being verified, its error state when credentials are wrong, and its success state just before redirect.

Output a complete design specification including layout description, element placement, color values, typography choices, and interaction behavior for each state.

---

### Prompt 1.2 — Login Form Field Behavior and Validation

You are a frontend UX engineer designing the field-level behavior and real-time validation experience for the Login Page.

The Email Address field should show a neutral gray border in its default state. When the user clicks into it the border changes to the primary green color to indicate focus. If the user exits the field without entering a value show an inline error message directly below the field saying Email address is required. If the user enters text that is not a valid email format show the message Please enter a valid email address. If the email is not registered in the system after form submission show the message No account found with this email address.

The Password field should follow the same focus behavior as the email field. If the user exits it without entering a value show the message Password is required. Never show password complexity rules on the login page as they are only relevant during registration. The show and hide toggle icon should switch between an eye icon when the password is hidden and a crossed-out eye icon when it is visible.

The Remember Me checkbox when checked stores the user session for thirty days so the user does not need to log in again when returning to the platform on the same device. When unchecked the session ends when the browser tab is closed.

The Sign In button should be fully disabled and visually grayed out only while a login request is in progress to prevent duplicate submissions. It should return to its active state if the login fails. Never disable the button before the user attempts submission.

After three consecutive failed login attempts on the same device trigger a CAPTCHA widget inline below the password field. The user must complete the CAPTCHA before they can attempt login again. After five failed attempts lock the account for thirty minutes and show a message explaining the lockout and when the account will be available again.

Define the exact text for every possible error message shown on this page, the precise moment each message appears, and the moment each message disappears when the user corrects the input.

Output a complete field behavior specification covering the default state, focus state, error state, and success state for every interactive element on the login form.

---

### Prompt 1.3 — Login Authentication Flow Description

You are a backend systems architect describing the complete server-side authentication process for the Login Page in plain English without any technical implementation details.

When the user submits their email and password the system first checks that both fields contain values and that the email is in a valid format before sending anything to the server. If either check fails the error is shown immediately without contacting the server.

Once the inputs pass client-side checks the system sends the credentials securely to the authentication service. The service looks up the account by email address. If no account is found the service returns a generic error that does not reveal whether the email or the password was the problem. This is intentional to prevent attackers from discovering which email addresses are registered.

If the account is found the service compares the submitted password against the stored value using a secure one-way comparison method. If the comparison fails the system increments a failed attempts counter attached to that account. When the counter reaches five the account is temporarily locked and the user receives an email notification explaining the lock and how long it will last.

If the password matches the service creates two tokens. The first is a short-lived access credential that expires after fifteen minutes and is used to authorize the user's actions on the platform. The second is a long-lived refresh credential that expires after thirty days and is used to silently generate new access credentials without requiring the user to log in again. The long-lived credential is stored in a way that prevents browser scripts from accessing it directly, providing protection against a common class of web attacks.

The service also records the login event in an audit trail that captures the time, the device type, and the general location derived from the network address. If the login originates from a country or device not seen before for that account the system sends an email alert to the registered address notifying the user of the new login.

Once authentication succeeds the system reads the user's role from the account record and redirects the browser to the appropriate starting page for that role.

Output a plain-English description of the full authentication process from the moment the user clicks Sign In to the moment they see their dashboard, covering every decision point and every possible outcome along the way.

---

## 2. REGISTRATION PAGE PROMPTS

---

### Prompt 2.1 — Registration Page Structure and Multi-Step Wizard Design

You are a senior product designer designing the complete Registration Page for new farm owners and organizations joining the AI Dairy Farm Management System platform.

The registration experience must use a three-step wizard layout to avoid overwhelming new users with a single long form. At the top of the page show a horizontal progress bar with three labeled steps. The active step is highlighted in the primary green color, completed steps show a checkmark, and future steps are shown in a neutral gray. Below the progress bar show the form for the current step centered on the page inside a card.

Step one is titled Account Details. This step collects everything needed to create the user's personal account. The fields are Full Name, Email Address with a real-time check that shows whether the email is already registered or available as the user types, Phone Number with a country code dropdown selector followed by an input field, a Verify button next to the phone number that sends an OTP to the entered number, Password with a live strength indicator that shows Weak in red, Medium in orange, and Strong in green as the user types, Confirm Password with a live indicator that shows whether the two fields match, and an optional Profile Photo upload area showing a circular preview of the selected image. The step navigation shows only a Next button at this stage.

Step two is titled Farm Information. This step collects all details about the farm operation. The fields are Farm Name, Farm Type as a dropdown with options for Dairy Only, Mixed Farm, Organic, and Corporate, Total Number of Cattle as a number input, Primary Breed as a multi-select field with options for Holstein-Friesian, Jersey, Gir, HF Cross, and Other, Country as a searchable dropdown, State or Province as a dropdown that updates dynamically based on the selected country, District or City as a text field, Farm GPS Location with an auto-detect button that fills the coordinates automatically and a manual override option, Farm Area in Acres as a number input, Approximate Daily Milk Production in litres as a number input, and a Cooperative Member toggle that when switched on reveals two additional fields for Cooperative Name and Member ID. The step navigation shows a Back button and a Next button.

Step three is titled Plan and Agreement. This step shows three subscription plan cards side by side. The Starter plan card is labeled Free and shows a list of included features for farms with up to fifty cattle. The Growth plan card shows a monthly price with a list of full AI features for farms with up to five hundred cattle. The Enterprise plan card shows Custom Pricing for unlimited cattle with dedicated support. Each card has a Select Plan button that highlights the chosen card with a green border. Below the plan cards show a billing cycle toggle between Monthly and Annual with a badge showing ten percent savings on the annual option. Below the billing toggle show the accepted payment methods as icons for Credit Card, UPI, Net Banking, and Invoice. Below the payment methods show two mandatory checkboxes, one for the Terms of Service and one for the Privacy Policy, each with a clickable link that opens the document in a new tab. Show a third optional checkbox for receiving product updates and newsletters that is pre-checked by default. The final action button at the bottom says Create My Farm Account and it is disabled until both mandatory checkboxes are checked.

Additional behaviors across all steps include preserving all entered data if the user navigates back to a previous step, auto-saving the form progress so a returning user who enters the same email finds their data pre-filled, a Sign up with Google option at the top of step one that auto-fills the name and email fields from the Google account, and a right side panel visible on desktop that shows contextual animated illustrations and bullet points explaining the value the user gains from completing each step.

On mobile devices hide the right panel and display a single full-width vertical form with keyboard-aware scrolling so the active field is always visible above the keyboard.

Output a complete design specification for each of the three steps including field list, layout, validation indicators, navigation buttons, and mobile behavior.

---

### Prompt 2.2 — Phone OTP Verification Experience

You are a UX designer describing the complete phone number OTP verification experience during registration.

After the user enters their phone number in Step one and clicks the Verify button, the system sends a six-digit one-time code to the entered number via SMS. An inline verification panel expands directly below the phone number field without navigating away from the page.

The verification panel shows a title that says Enter Verification Code, a subtitle that says We sent a 6-digit code to the phone number the user entered, and six individual single-character input boxes arranged in a horizontal row. When the user types the first digit focus automatically moves to the second box, and so on until all six digits are entered. When all six boxes are filled the system automatically submits the code without requiring the user to press any button. If the user pastes a copied code from their clipboard all six boxes fill instantly. On mobile devices the numeric keyboard opens automatically when the panel appears.

Below the input boxes show a countdown timer that starts at forty-five seconds and counts down to zero. While the timer is running show the text Resend code in 0:45 in a gray color. When the timer reaches zero the text changes to Resend Code and becomes a clickable link in the green color. After the user clicks Resend the timer resets and a new code is sent. Allow a maximum of three resend attempts. After three resends show the message Too many attempts. Please try again in one hour and disable the resend option.

Show a Change Number link below the timer that allows the user to edit their phone number and restart the verification process.

The panel shows four possible outcome states. The verifying state shows a small loading spinner replacing the submit button while the code is being checked. The success state shows a green checkmark animation, the text Phone number verified successfully, and then closes the panel and marks the phone field with a green checkmark. The error state shows a red border on all six input boxes, a message below saying Incorrect code with the number of remaining attempts shown, and clears the boxes so the user can try again. The expired state appears if more than ten minutes pass and shows a message saying This code has expired with a prompt to request a new one.

Output a complete behavioral specification for the OTP verification panel covering all four outcome states, the resend flow, the change number flow, and the mobile keyboard experience.

---

### Prompt 2.3 — Registration Completion and Welcome Experience

You are a product manager describing the complete experience from the moment the user clicks Create My Farm Account to the moment they are actively using the platform.

When the user clicks the final button the page shows a full-screen loading state with the platform logo, an animated progress indicator, and the message Setting up your farm dashboard. This takes no longer than three seconds. During this time the system creates the user account, creates the farm profile, assigns the farm owner role, activates a fourteen-day free trial of the Growth plan, and sends two emails.

The first email is a welcome email with the subject Welcome to DairyAI, Your Smart Farm Starts Here. The body of this email addresses the user by their first name, mentions the farm name they registered, highlights the three most important actions they should take first which are adding their cattle, connecting their first sensor, and exploring the health dashboard, reminds them they have fourteen days of full access on their free trial, and includes a large Explore My Dashboard button. The email also contains a secondary link to verify the email address.

The second email is an email verification email with a button that when clicked marks the email as confirmed. This email is sent only if the user did not sign up via Google.

After the loading screen the user is taken to the Onboarding Wizard, not directly to the main dashboard. The Onboarding Wizard is a guided experience that walks the user through four steps. Step one shows a welcome message personalized with the farm name and a Start Setup button. Step two asks the user to add their first cattle group by entering a group name, selecting a breed, and entering the number of animals. Step three asks the user to connect their first data source by selecting from options for IoT Sensor, File Upload, or Manual Entry. Step four shows a short video tour of the main dashboard features. After completing or skipping the wizard the user lands on the main Farm Dashboard with a checklist widget in the sidebar tracking their onboarding progress.

A banner at the top of every page during the trial period shows the number of days remaining in the trial and a button to upgrade to a paid plan.

Output a complete narrative of the post-registration experience from button click to first meaningful action on the platform, covering loading states, emails, onboarding steps, and trial indicators.

---

## 3. FORGOT PASSWORD AND ACCOUNT RECOVERY PROMPTS

---

### Prompt 3.1 — Forgot Password Flow

You are a UX engineer describing the complete Forgot Password experience from the user's perspective.

When the user clicks the Forgot Password link on the login page they are taken to a new page with a simple centered card layout. The card shows a lock icon at the top, a heading that says Reset Your Password, and a short paragraph explaining that entering their registered email address will result in receiving a link to create a new password. Below the paragraph is a single Email Address input field and a Send Reset Link button.

When the user submits their email the page transitions to a confirmation state regardless of whether the email is registered or not. This behavior is intentional to prevent revealing which email addresses exist in the system. The confirmation state shows an envelope icon, a heading that says Check Your Email, and a message that says If an account exists for that email address, we have sent a password reset link. The link will expire in one hour. A secondary link says Did not receive an email and walks the user through checking their spam folder or trying a different email address.

When the user clicks the reset link in their email they are taken to the Reset Password page. This page shows the platform logo, a heading that says Create a New Password, and two fields — New Password and Confirm Password. Below the fields show a password strength indicator and a bulleted list of requirements the password must meet. Requirements include a minimum of eight characters, at least one uppercase letter, at least one lowercase letter, at least one number, and at least one special character. Each requirement line shows a gray circle that turns into a green checkmark as the user types and meets that specific requirement in real time.

When the user submits their new password the system validates it, updates the account, and signs out all active sessions on all devices. The user then sees a success page with a checkmark icon, the message Your password has been updated successfully, and a button to Return to Login. At the same time the system sends a confirmation email to the registered address informing the user that their password was changed and providing a contact link if they did not make this change themselves.

If the reset link has already been used or has expired when the user clicks it, show a page explaining that the link is no longer valid with a button to request a new one.

Output a complete flow description for the Forgot Password journey covering every screen, every possible outcome, and every email communication involved.

---

## 4. AUTHENTICATION AND SESSION SECURITY PROMPTS

---

### Prompt 4.1 — Session Management and Active Device Control

You are a security product manager describing the complete session management experience from the user's perspective.

In the Account Settings area under a section labeled Security and Devices, show the user a list of all currently active login sessions. Each session entry in the list shows the device type such as Desktop, Tablet, or Mobile, the browser name, the operating system, the approximate location derived from the network address showing the city and country, the date and time the session was first created, and the date and time it was last active.

The current session from which the user is viewing this page is labeled This device in a green badge. All other sessions have a Sign Out button next to them. At the top of the list show a Sign Out of All Other Devices button that terminates every session except the current one.

When the user clicks Sign Out next to a specific session show a small confirmation message asking them to confirm before proceeding. After confirmation that session is invalidated immediately.

If a new login occurs from a country the user has never logged in from before, send an email alert to the registered address. The email shows the location, the device type, the approximate time, and two action buttons. One button says This Was Me and does nothing. The other button says This Was Not Me and immediately locks the account and guides the user through a password reset.

Output a complete description of the Sessions and Devices interface including the list layout, all session details shown, all available actions, and the new location alert email.

---

### Prompt 4.2 — Two-Factor Authentication Setup

You are a security UX designer describing the complete Two-Factor Authentication setup and login experience.

In Account Settings under Security the user sees a section labeled Two-Factor Authentication with a status indicator showing either Enabled in green or Disabled in gray and a button to toggle the state.

When the user clicks Enable Two-Factor Authentication the page shows a three-step setup flow. Step one explains what two-factor authentication is and why it makes the account more secure. It shows two method options as selectable cards. The first card says Authenticator App and is labeled as Recommended. The second card says SMS to Phone Number. The user selects one and clicks Continue.

If the user selects Authenticator App, step two shows a large scannable QR code and below it a text string the user can manually enter into their authenticator app if scanning does not work. The page shows instructions to open an app such as Google Authenticator or Authy and scan the code. Below the QR code is a six-digit verification input where the user enters the first code generated by the app to confirm the setup worked correctly.

If the user selects SMS, step two shows their registered phone number pre-filled and a Send Test Code button. After clicking the button a six-digit code arrives by SMS and the user enters it to confirm the setup.

Step three appears after a successful verification code is entered. It shows ten backup codes displayed in a clear grid. A prominent warning message explains that these codes can each be used once to access the account if the primary method is unavailable. Two buttons appear below the codes — Download Backup Codes and I Have Saved My Codes. The setup is not completed until the user clicks the second button confirming they have saved the codes.

After setup is complete the login flow gains an additional step. After entering the correct email and password the user is taken to a second page that asks for the six-digit code from their authenticator app or SMS. The page also shows a Use a Backup Code option. If the correct code is entered the user proceeds to the dashboard normally.

Output a complete description of the two-factor authentication setup wizard and the modified login experience, covering all method options, all steps, all possible error states, and the backup code system.

---

## 5. CREATE NEW DATASET PROMPTS

---

### Prompt 5.1 — Create New Dataset Wizard Overview

You are a senior data product manager describing the complete experience for creating a new dataset in the AI Dairy Farm Management System.

The Create New Dataset feature uses a four-step wizard. A user accesses this wizard by clicking the New Dataset button on the Dataset Management Dashboard. A horizontal progress indicator at the top shows four steps labeled Basics, Source, Schema, and Review. The current step is highlighted and completed steps show checkmarks.

Step one is Basics. The user enters a Dataset Name in a text field with a maximum length of one hundred characters. Below it is a Description field using a larger text area with a five hundred character limit and a live character counter. Below the description is a Category dropdown with the following options — Health and Disease Data, Milk Production Records, Feed and Nutrition Data, Reproductive Records, Financial and Market Data, Environmental and Weather Data, Sensor and IoT Raw Data, and Custom. Below the category is a Tags input where the user types a word and presses Enter to add it as a chip. Chips can be removed by clicking the cross icon on each one. Below the tags is a Visibility selector with three radio options — Private which means only the user's farm can see it, Shared which means all farms in the same cooperative can access it, and Public which means all farms on the platform can see an anonymized version. A Color Label picker at the bottom lets the user choose a color to identify this dataset visually on the dashboard. The step navigation shows a Cancel link and a Next button.

Step two is Source. The user selects where the data comes from. Five source type tiles are shown in a grid. File Upload supports comma-separated, Excel, JSON, XML, and Parquet formats. Database Connection supports MySQL, PostgreSQL, MongoDB, and BigQuery. API or Webhook supports any REST endpoint with configurable authentication. IoT Sensor Stream lets the user select from their registered farm sensors. Import from Existing Dataset lets the user reuse data from another dataset already in the system. The user can select multiple source types. After selecting a source type an additional configuration panel expands below the tiles specific to that source. For File Upload the panel shows a drag and drop area with a Browse button, a preview of the first ten rows after a file is selected, and a column mapping tool to align incoming column names with the platform schema. For Database Connection the panel shows fields for the connection details, a table selector, and a sync frequency dropdown. For API the panel shows fields for the endpoint URL, authentication method, and polling interval. For IoT Sensor Stream the panel shows checkboxes for each registered sensor and a date range picker. For Import from Existing Dataset the panel shows a searchable list of the user's existing datasets with filter options.

Step three is Schema. If data was uploaded or connected in the previous step the system auto-detects the columns and displays them in an editable table. Each row in the table represents one column and shows five editable fields — Column Name, Data Type selected from options like Text, Integer, Decimal, True or False, Date, Date and Time, Category List, Location, and JSON, a Required toggle, a Description text field, and a Unit of Measurement text field. An additional Validation Rule column allows the user to set constraints such as minimum and maximum values for numbers or a pattern rule for text. At the bottom of the table a plus button adds a new empty column row. Two additional fields below the table let the user designate which column is the Primary Identifier and which column is the Timestamp used for time-series ordering.

Step four is Review. This step shows a read-only summary card containing every setting chosen in the previous three steps. Below the summary a Data Quality Preview panel shows the estimated row count, the percentage of complete values in each column, the number of detected duplicate rows, the number of detected outlier values, and the date range of the data. At the bottom of the review step are two buttons. The primary button says Create Dataset. A secondary button says Create and Run Quality Check which creates the dataset and immediately launches a full data quality analysis job.

Output a complete specification for each of the four wizard steps including every field, every interaction, every configuration panel, and the behavior of both action buttons at the end.

---

### Prompt 5.2 — Dataset Management Dashboard Design

You are a data product designer describing the Dataset Management Dashboard where users see, search, and manage all their datasets.

The dashboard page has a header row containing the page title My Datasets on the left and two buttons on the right — a primary green New Dataset button and a white secondary Import from Library button. Below the title on the left side show three summary statistics displayed as small stat cards — Total Datasets showing the count, Total Records showing the number formatted with commas, and Storage Used showing the size in gigabytes.

Below the header row is a filter and search bar. On the left side is a search input that filters results in real time as the user types, matching against dataset names, descriptions, and tags. On the right side are four filter dropdowns — Category, Visibility, Status, and Sort By. Status options are Active, Processing, Error, and Archived. Sort By options are Last Updated, Name A to Z, Size Largest First, and Records Most First. A small icon button on the far right toggles between a grid view and a list view.

In grid view each dataset is shown as a card. The card has a colored square icon in the top left corner using the color label assigned during creation. To the right of the icon is the dataset name in bold and below it the category badge. The middle of the card shows the record count and the last updated date. The bottom row of the card shows three small icons representing the source type, the visibility level, and the current status. A three-dot menu icon in the top right corner of the card opens a dropdown menu with actions including View and Explore, Edit Schema, Add More Data, Download, Share, Duplicate, Archive, and Delete.

In list view each dataset is shown as a horizontal row in a table. The columns are a color icon, Dataset Name, Category, Records, Last Updated, Source, Visibility, Status, and an Actions column with the same three-dot menu.

Clicking on any dataset card or row opens the Dataset Detail page. This page has a breadcrumb navigation at the top and a tab bar below the dataset name with tabs labeled Overview, Data Explorer, Schema, Import History, Connected Models, Sharing, and Settings.

The Overview tab shows the full description, all tags, the creation date and creator name, and a row of key statistics cards.

The Data Explorer tab shows the dataset rows in a spreadsheet-style table with sortable and filterable columns, a search bar, pagination controls, a row count indicator, checkboxes for selecting rows for bulk actions, an Add Row button, and an Import More Data button.

The Schema tab shows the full column definition table from the creation wizard in an editable format.

The Import History tab shows a chronological list of all data load events with the filename or source name, timestamp, rows added, rows failed, and status for each.

The Connected Models tab lists all AI models that are currently trained on or using this dataset, with links to each model.

The Sharing tab shows who currently has access to the dataset, an Invite by Email input, and a dropdown to set the access level for each invited person.

The Settings tab allows renaming the dataset, changing its category or visibility, archiving it, or permanently deleting it with a confirmation step.

Output a complete design description for the Dataset Management Dashboard and Dataset Detail page covering every tab, every field, every action, and every interactive element.

---

### Prompt 5.3 — Dataset Versioning and History

You are a data governance specialist describing the dataset versioning system that tracks every change and allows users to restore previous states.

Every dataset in the system maintains a complete version history. A new version snapshot is created automatically whenever any of the following events occur — a new batch of data is imported from a file or external source, a column is added, removed, or renamed in the schema, a bulk deletion of more than ten rows is performed, a scheduled sync from a connected database or API completes, or an AI model training job begins using this dataset. Users can also create a manual version checkpoint at any time by clicking Save Version in the dataset settings.

Each version entry in the history list shows a version number in the format v1 dot 0, an optional user-assigned label such as Q1 Clean Data or Pre-Training Snapshot, the date and time it was created, the name of the user or automated process that created it, a short change summary describing what changed such as rows added with a count, rows deleted with a count, and any schema modifications, the total row count at that version, and the total storage size at that version.

The version history is accessible from a Version History button in the dataset toolbar. Clicking it opens a full-page panel or modal showing the list of all versions sorted from newest to oldest. Each version row has two action buttons — View and Restore.

Clicking View opens a read-only snapshot of the dataset as it existed at that version, showing the schema and the data in the same Data Explorer interface but with a banner clearly stating This is a historical version and no edits can be made here.

Clicking Restore triggers a confirmation dialog that warns the user the current dataset will be replaced with the selected version and that the current state will first be saved automatically as a new version to prevent data loss. After confirming, the system performs the restore and adds a new version entry labeled Restored from v2.3 to record the action.

Version snapshots are stored using an efficient storage approach where the first version keeps a complete copy of the dataset and all subsequent versions store only the changes from the previous version. Full snapshots are kept for ninety days. After ninety days only monthly snapshots are retained. After one year all snapshots are deleted unless the farm administrator has configured a longer retention period in the platform settings.

Output a complete description of the versioning system covering what triggers a new version, what information each version record contains, how users access and compare versions, how restoration works, and how long versions are retained.

---

## 6. ADD NEW DATASET FROM NEW APPLICATION PROMPTS

---

### Prompt 6.1 — Application Marketplace Overview and Discovery

You are a platform product manager describing the Application Marketplace where farm users discover and install new AI-powered modules that extend the platform.

The Application Marketplace is accessed from the main navigation sidebar under a menu item labeled Marketplace. The page header shows the title Application Library and a subtitle explaining that users can extend their farm intelligence by installing specialized AI modules.

Below the header is a search bar spanning the full width of the page. Below the search bar is a horizontal scrollable row of category filter chips. Each chip represents an application category and becomes highlighted when selected. The categories are Herd Health, Milk Production, Feed and Nutrition, Financial Intelligence, Reproduction Management, Environmental Monitoring, Integrations, Analytics and Reports, and AI Model Builder.

The main content area shows application cards in a responsive grid. Each card contains the application icon in a rounded square, the application name in bold text, the category badge below the name, a one-line description of what the app does, a star rating with the numeric average and the number of farms that have rated it, a price indicator showing either Free, a monthly price, or Included in Growth Plan, and a status button that shows Install for apps not yet installed or Installed with a green checkmark for apps already installed.

Clicking on an application card opens the Application Detail page. This page shows the full application icon and name at the top, followed by a row of summary statistics showing the average rating, the total number of installations, and the date of the most recent update. Below the statistics is a full description of the application in rich text. Below the description is a Screenshots and Preview section showing three to five annotated screenshots of the application interface. Below the screenshots is a Features section listing the key capabilities as a clear bullet-point style list. Below features is a Requirements section listing the minimum cattle count, the required sensor types if any, the required data sources, and the subscription plan required to install the app. Below requirements is a Data Permissions section that explicitly lists every data type the application will read and every data type it will write, presented in a transparent and user-friendly format. Below permissions is a Reviews section showing individual user reviews with their farm size, their star rating, and a written comment. At the top right of the detail page is a large Install Now button.

Output a complete description of the Marketplace discovery experience covering the search and filter interface, the application card layout, the Application Detail page structure, and all sections visible before installation.

---

### Prompt 6.2 — Application Installation and Dataset Creation Flow

You are a product designer describing the complete flow for installing a new application that requires creating or connecting a new dataset.

When the user clicks Install Now on the Application Detail page a multi-step installation wizard begins in a full-page overlay or a dedicated installation page.

Step one is titled Review Permissions. This step shows the application name and icon at the top followed by two clearly separated panels. The left panel is labeled This app will read and lists every data type the application needs to access, such as cattle health records, daily milk yield, and activity sensor data. The right panel is labeled This app will write and lists every output the application will create, such as health alert notifications and a new predictive health score column on cattle records. Below the panels is a checkbox the user must tick that says I understand what this app will access followed by an Accept and Continue button.

Step two is titled Connect Your Data. This step is only shown for applications that require a specific dataset that does not yet exist for the farm. The step presents two options as selectable cards side by side. The first card says Use Existing Dataset and shows a searchable dropdown listing all compatible datasets already in the farm's library. The second card says Create New Dataset and opens a simplified version of the dataset creation wizard covering only the Basics and Source steps, since the application defines the schema automatically. After the user either selects an existing dataset or completes the mini dataset creation flow the step shows a green confirmation with the dataset name and a summary of its contents.

Step three is titled Configure Settings. This step shows application-specific configuration options that vary by app. Common configuration options include which cattle group or groups to apply the application to presented as a multi-select, the alert delivery preferences such as push notification, SMS, or email, the alert threshold values such as the health risk score above which an alert is sent, and the update frequency defining how often the application analyzes new data. Each configuration option shows a brief explanation of what it controls.

Step four is titled Choose Placement. This step shows a simplified preview of the farm dashboard as a wireframe diagram. The user can drag a representation of the new application widget to the position on the dashboard where they want it to appear. Preset placement options are also provided as a quick alternative for users who prefer not to drag and drop.

Step five is titled Installing. This step shows an animated progress indicator with three sequential status messages that appear one after another — Connecting to your data, Analyzing your farm history, and Setting up your dashboard. This process completes within thirty seconds. After completion the step transitions to a success state showing a large checkmark, the message your application is ready, and two buttons — one to Go to App and one to Return to Marketplace.

After installation the application appears in the My Installed Apps section and its widget appears on the dashboard in the position the user selected. A first-run tooltip sequence guides the user through the new interface elements with short explanations that the user can dismiss one at a time.

Output a complete description of the installation wizard covering all five steps, the dataset creation mini-flow within step two, all configuration options in step three, the dashboard placement interaction in step four, and the post-installation experience.

---

### Prompt 6.3 — Create a Custom Application with a New Dataset

You are a senior product manager describing the experience for advanced users who want to build a completely custom AI application and create a brand new dataset to power it.

Advanced users access the Custom App Builder from the Marketplace by clicking a button labeled Build Your Own App in the top right area of the page. This opens a five-step creation wizard.

Step one is titled Define Your App. The user fills in the App Name, a short description of up to one hundred and fifty characters that will appear on app cards in the marketplace, a longer description with formatting options that appears on the detail page, the App Type chosen from a list including AI Prediction Model, Automated Alert System, Data Transformation Pipeline, Custom Report Builder, and External Integration Connector, the Category from the same list used in the marketplace, an App Icon uploaded as an image, and a Visibility setting of Private meaning only this farm can use it, Farm Network meaning all farms in the cooperative can install it, or Public Marketplace meaning it is submitted for review and listed for all platform users.

Step two is titled Define Data Access. Two columns are shown side by side. In the left column labeled Data to Read the user browses a categorized tree of all available data types on the platform and checks the boxes next to the ones the application needs access to. In the right column labeled Data to Write the user selects what the application will create or modify. Editable outputs include creating alert notifications, writing prediction scores to cattle records, creating a new output dataset, and triggering an external system via webhook. A permission summary at the bottom recaps the selections in plain language before the user proceeds.

Step three is titled Build App Logic. This step adapts based on the App Type selected in step one. For an AI Prediction Model the user selects an existing dataset as the training source, selects the input feature columns from that dataset, selects the target output column to predict, chooses a model type from a list of plain-English options such as Predict a number, Classify into categories, or Detect anomalies, and sets the evaluation target metric. A train button initiates a background training job and the page shows a progress indicator. For an Automated Alert System the user uses a visual rule builder with a plain-English sentence structure. The user picks a data field from a dropdown, picks a comparison operator such as is greater than or is less than, enters a threshold value, and adds additional conditions using AND or OR. The resulting rule reads as a complete sentence such as Send an alert when the somatic cell count is greater than four hundred and the activity score is less than fifty. For an External Integration Connector the user enters the external system URL, selects an authentication method, maps incoming external fields to platform fields using a drag and drop column matching interface, and sets a sync schedule.

Step four is titled Test in Sandbox. The system runs the custom application against the last seven days of the farm's actual data in a protected environment that does not affect any live records. The page shows a results preview — for a prediction model this shows a sample of predictions with a confidence score, for an alert system this shows a list of alerts that would have been triggered with the data that caused each one, for an integration this shows a preview of the data that would have been imported. The user can review the results, see any errors in a log panel, and either approve the results to proceed or go back and adjust the logic.

Step five is titled Deploy Your App. The user selects a deployment mode from three options — Run on a Schedule where the user sets a time interval such as every hour or every day, Run on Demand where the user manually triggers the application from the dashboard when needed, or Run in Real Time where the application processes new data instantly as it arrives from sensors or connected sources. A final Deploy App button makes the application live. The app immediately appears in the user's installed apps and on their dashboard.

At any point during the wizard the user can save a draft and return later to continue from where they left off. Draft applications appear in a Drafts section in the My Apps area.

Output a complete description of the Custom App Builder wizard covering all five steps in detail, the three App Type logic builder variations, the sandbox testing experience, and the three deployment mode options.

---

## 7. ROLE-BASED ACCESS CONTROL PROMPTS

---

### Prompt 7.1 — User Roles and Permission Levels

You are an enterprise access control designer describing the complete role and permission system for the dairy farm platform.

The platform defines eight user roles, each with a distinct set of permissions across all platform modules.

The Super Admin role belongs to platform administrators at the company level. This role has unrestricted access to every farm, every dataset, every application, and every configuration setting on the entire platform. Super Admins can log in as any user for support purposes with every such action recorded in a permanent audit log.

The Farm Owner role is the highest role within a single farm. Farm Owners have complete control over their farm including all data, all settings, all team member management, and all billing decisions. They can install and configure any application and create or delete any dataset.

The Farm Manager role has full operational control but cannot access billing, cannot invite or remove team members, cannot delete the farm, and cannot change the subscription plan. Farm Managers can view and edit all operational data including cattle records, health data, feed schedules, datasets, and applications.

The Veterinarian role has full read access to all health-related data and can create and update health records, diagnoses, and treatment logs. Veterinarians cannot view financial data, feed costs, market prices, or subscription details. They can generate and export health reports.

The Feed Manager role has full read and write access to feed inventory, feeding schedules, and nutrition data. They have read-only access to cattle records and milk production data. They cannot access health records, financial data, or dataset management.

The Data Analyst role has read access to all data types across all modules. Analysts can create and run reports, export data in any format, build custom datasets, and train custom AI models. They cannot modify any operational farm record.

The Cooperative Officer role is an external role for users from a dairy cooperative organization. They can only see milk production records, quality data, and procurement-related information for the farms in their supplier network. They cannot see any individual cattle health data, financial records, or internal farm settings.

The Field Worker role is designed for farm labour users who primarily use the mobile app. Field Workers can log their daily observations such as confirming that feeding has been completed and noting any behavioral observations about specific animals. They can view their assigned task alerts. They cannot access the analytics dashboard, dataset management, financial information, or any administrative settings.

The permission matrix below shows each role mapped against each platform module with the actions they can perform. The actions are Create, Read, Update, Delete, and No Access.

Cattle Records — Farm Owner has all actions, Farm Manager has all actions, Veterinarian can read only, Feed Manager can read only, Data Analyst can read only, Cooperative Officer has no access, Field Worker can read only.

Health Records — Farm Owner has all actions, Farm Manager has all actions, Veterinarian has all actions, Feed Manager has no access, Data Analyst can read only, Cooperative Officer has no access, Field Worker has no access.

Feed and Nutrition Data — Farm Owner has all actions, Farm Manager has all actions, Veterinarian can read only, Feed Manager has all actions, Data Analyst can read only, Cooperative Officer has no access, Field Worker can read only.

Financial Data — Farm Owner has all actions, Farm Manager can read only, Veterinarian has no access, Feed Manager has no access, Data Analyst can read only, Cooperative Officer has no access, Field Worker has no access.

Datasets — Farm Owner has all actions, Farm Manager has all actions, Veterinarian can read only, Feed Manager can read only, Data Analyst has all actions, Cooperative Officer can read allowed datasets only, Field Worker has no access.

Applications — Farm Owner has all actions, Farm Manager can read and use, Veterinarian can read and use, Feed Manager can read and use, Data Analyst has all actions, Cooperative Officer has no access, Field Worker has no access.

User and Team Management — Farm Owner has all actions, Farm Manager can read only, all other roles have no access.

Alerts and Notifications — Farm Owner has all actions, Farm Manager has all actions, Veterinarian has all actions for health alerts, Feed Manager has all actions for feed alerts, Data Analyst can read only, Cooperative Officer can read relevant alerts, Field Worker can read assigned alerts.

Reports and Exports — Farm Owner has all actions, Farm Manager has all actions, Veterinarian can create and read health reports, Feed Manager can create and read feed reports, Data Analyst has all actions, Cooperative Officer can create and read procurement reports, Field Worker has no access.

Platform Settings — Farm Owner has all actions, Farm Manager can read only, all other roles have no access.

Output a complete description of all eight user roles, a plain-English explanation of what each role can and cannot do, and the full permission matrix covering every module.

---

## 8. VALIDATION AND ERROR HANDLING PROMPTS

---

### Prompt 8.1 — Form Validation Strategy Across All Pages

You are a frontend quality engineer describing the comprehensive validation strategy for all forms across the platform.

Validation happens in three layers that work together to catch errors as early and as clearly as possible.

The first layer is immediate client-side validation that happens as the user interacts with each field without any server communication. This layer catches formatting errors and empty required fields before any data is sent anywhere.

The second layer is server-side validation that runs after the user submits a form. This layer checks business rules such as whether an email address is already taken, confirms that the submitted data meets all constraints, and performs security checks on the content.

The third layer is database-level enforcement that acts as a final safety net to maintain data integrity even in cases where the application layers miss something.

For the Login form the email field shows an error immediately when the user leaves the field empty or when they enter text that is not a valid email format. The password field shows an error only when the user leaves it completely empty. No other validation is shown on the login form before submission because revealing password rules could help an attacker.

For the Registration form Step one the Full Name field shows an error if left empty, if it contains fewer than two characters, if it exceeds one hundred characters, or if it contains characters other than letters and spaces. The Email field shows a real-time availability indicator that appears after a brief pause when the user stops typing. A spinning indicator shows while checking, a green checkmark with the word Available shows if the email is not taken, and a red cross with the message This email is already registered shows if it is taken. The Phone field shows an error if the format does not match the pattern expected for the selected country code. The Verify button next to the phone field is disabled until the phone format is valid. The Password field shows a visual strength meter that updates character by character. The Confirm Password field shows a green match indicator or a red mismatch indicator that updates in real time as the user types in either the password or confirm password field.

For the Registration form Step two the Farm Name field shows an error if empty or under three characters. The Cattle Count field shows an error if empty, if zero is entered, if a negative number is entered, or if a non-numeric character is entered. At least one breed must be selected before proceeding. Country is required before State becomes active. State is required and updates based on the selected country.

For the Dataset creation form the Dataset Name field shows an error if empty, under three characters, or if a dataset with the same name already exists in the farm's library. The Description field shows a live character counter and prevents typing beyond five hundred characters. The Category field shows an error if no selection is made. For file uploads the system validates the file format before uploading begins and shows an error immediately if the format is not supported. For files that are too large the system shows the error before upload starts.

Error messages must always be written in plain language from the user's perspective. Never show technical error codes or system messages to the user. Each message tells the user exactly what is wrong and how to fix it. For example instead of Invalid input say Please enter only letters and spaces in the farm name field. Instead of Conflict say This email address is already associated with an account. Would you like to log in instead? with a link to the login page. Instead of Required field say Please enter your farm name before continuing.

Error messages appear directly below the field they describe, in a red color, with a small warning icon to the left of the text. Success states appear as a green checkmark icon or green border on the field. Neutral states use a gray border.

Toast notification messages appear in the bottom right corner of the screen for errors that happen after form submission such as a server error or a timeout. These toasts show for five seconds and then fade out. Critical errors that require user action before continuing appear as a full banner across the top of the form with a dismiss button.

Output a complete validation specification for every form on the platform covering field-level rules, timing of each error, exact error message text, and the visual treatment of error, success, and neutral states.

---

## 9. UI AND UX DESIGN SPECIFICATION PROMPTS

---

### Prompt 9.1 — Design System and Visual Language

You are the lead designer defining the complete design system for the AI Dairy Farm Management web application.

The brand is called DairyAI and its tagline is Smart Farming, Smarter Profits. The four core brand values that should be expressed through the design are Trust, Intelligence, Simplicity, and Growth.

The primary color is a deep agricultural green used for all primary action buttons, active navigation items, selected states, and success indicators. The hover state for this color is a slightly lighter shade of the same green. The active or pressed state uses a darker shade. A light tint of the primary green is used for selected row backgrounds in tables and for highlighted areas in forms.

The warning color is a warm amber used for medium-priority alerts, warnings, and items that need attention but are not critical. The error or critical color is a strong red used for destructive action confirmations, critical health alerts, and validation error messages. The informational color is a calm blue used for tooltips, informational banners, and help text. The neutral text color for body content is a dark gray that provides sufficient contrast on white backgrounds.

The background of the overall application is a very light green-tinted white that subtly reinforces the agricultural theme without being distracting. Content cards sit on pure white with a subtle shadow to lift them off the background. Dividers between sections use a very light gray.

Typography uses a single geometric sans-serif typeface for all text on the platform to maintain consistency and readability. Page and section titles use the heaviest weight. Subsection headings use a medium-heavy weight. Body text and labels use the regular weight. Monospace text for data values and numbers in tables uses a separate typeface designed for numerical clarity.

The spacing system uses a consistent scale based on a four-pixel unit. Padding inside components uses multiples of four. Margins between components use larger multiples. This ensures visual rhythm and consistency across every screen.

All interactive components must support five states — default showing the normal appearance, hover showing a subtle visual change when the cursor is over the element, active or pressed showing a visual response during the click, focused showing a visible outline for keyboard navigation users, and disabled showing reduced opacity and a not-allowed cursor to indicate the element cannot be used.

Buttons come in four styles. The primary style is a solid green background used for the single most important action on any screen. The secondary style is an outlined button with a green border and green text used for supporting actions. The danger style is a solid red background used only for destructive actions such as deleting a dataset. The ghost style has no background or border and is used for low-emphasis actions in dense interfaces.

Form inputs are forty-eight pixels tall with a light gray default border, a green border on focus, a red border when showing an error, and a green border with a checkmark indicator when the field value is confirmed valid.

Data tables use alternating row background colors for readability, a sticky header row that stays visible while scrolling, sortable column headers indicated by an arrow icon, selectable rows with checkboxes, and a clear hover state on each row.

Cards group related content in a visually bounded container with sixteen pixels of internal padding, a subtle shadow, and eight-pixel rounded corners. Cards do not use heavy borders.

Notification toasts appear in the bottom right corner of the browser window above any other content. They use the four status colors — green for success, amber for warning, red for error, and blue for information. Each toast shows an icon, a brief message, and a dismiss button.

Empty states appear when a list or data view has no content. Each empty state shows an illustrated icon relevant to the content type, a short explanation of why the area is empty, and a primary action button to add the first item.

Loading states use a skeleton screen pattern showing gray animated placeholders in the shape of the expected content. This is preferred over a spinner because it reduces the perceived wait time and prevents layout shift when content loads.

All interactive elements must meet accessibility requirements for keyboard navigation, screen reader compatibility, and color contrast ratios meeting the WCAG 2.1 AA standard.

Output a complete design system specification covering the color palette, typography scale, spacing system, all component states, button styles, form input behavior, table design, card design, notification toasts, empty states, loading states, and accessibility requirements.

---

## 10. DATABASE AND API DESIGN PROMPTS

---

### Prompt 10.1 — Database Structure Description

You are a database architect describing the complete database structure for the authentication, user management, and dataset management features in plain English without any technical syntax.

The users table is the central record for every person who has an account on the platform. Each user record stores a unique identifier, the email address which must be unique across all users, an optional phone number which must also be unique, separate flags indicating whether the email and phone have been verified, the securely stored password, the full name, an optional link to the profile photo, the account status which can be active, suspended, or deleted, all information needed to support two-factor authentication including the secret key and a list of backup codes, a counter tracking consecutive failed login attempts, a timestamp indicating when a lockout expires if the account is currently locked, a timestamp of the most recent successful login, and the timestamps when the record was created and last updated.

The user sessions table stores one record for each active login session. Each record stores a unique identifier for the session, the identifier of the user it belongs to, a securely stored version of the refresh credential, the type of device used such as desktop or mobile, the browser name, the operating system, the network address at login time, the approximate country and city derived from the network address, a flag indicating whether the user has marked this device as trusted for two-factor authentication bypass, the timestamp of the most recent activity in this session, the timestamp when the session expires, a flag indicating whether the session has been revoked, and the timestamp when the session was created.

The password reset tokens table stores one record for each pending password reset request. Each record stores a unique identifier, the user it belongs to, a securely stored version of the reset token, the timestamp when the token expires, the timestamp when the token was used if it has been used, and the timestamp when it was created.

The farms table stores the profile of each farm registered on the platform. Each record stores a unique identifier, the farm name, the farm type, the total cattle count, an array of the primary cattle breeds, the country, state, and city, the GPS coordinates, the farm area, the approximate daily milk production, the cooperative membership details if applicable, the identifier of the owning user, and the timestamps of creation and last update.

The farm members table stores the relationship between users and farms, recording which users have access to which farms and in what capacity. Each record stores a unique identifier, the farm identifier, the user identifier, the assigned role, the identifier of the user who sent the invitation, the timestamp of the invitation, the timestamp when the user accepted, the current membership status which can be pending, active, or removed, and a constraint ensuring that each user can only have one role record per farm.

The datasets table stores one record for each dataset created by a farm. Each record stores a unique identifier, the farm it belongs to, the user who created it, the dataset name, description, category, tags, visibility level, current status, source type, the schema definition as a structured document, the current row count, the storage size, the color label, the current version label, and the timestamps of creation and last update.

The dataset versions table stores a snapshot record each time a version checkpoint is created. Each record stores a unique identifier, the dataset it belongs to, the version number string, an optional label, a summary document describing what changed, the row count at that version, a copy of the schema at that version, the storage size, the type of event that triggered this version, the identifier of the user or process that created it, and the creation timestamp.

The dataset imports table stores a log record for each data loading operation. Each record stores a unique identifier, the dataset it loaded into, the original filename or source name, the file size, the source type, the number of rows successfully added, the number of rows that failed with reasons, the import status, a log of any errors that occurred, the start and end timestamps, and the identifier of the user who initiated it.

The applications table stores the marketplace listing for each available application. Each record stores a unique identifier, a URL-safe key name, the display name, description, category, icon, pricing type, monthly price, the minimum required subscription plan, the average rating, the rating count, the installation count, the current version number, an active flag, and the creation timestamp.

The installed applications table records which applications have been installed by which farms. Each record stores a unique identifier, the farm identifier, the application identifier, the identifier of the user who installed it, the configuration settings chosen during installation stored as a structured document, an enabled flag, the installation timestamp, and the last used timestamp. A constraint ensures that each farm can only have one installation record per application.

The audit log table stores a permanent record of every significant action performed by any user on the platform. Each record stores a unique identifier, the user who performed the action, the farm context if applicable, the action name, the type of resource affected, the identifier of the specific resource, the network address of the request, the browser identification string, a structured document with additional context about the action, and the timestamp.

Output a complete plain-English description of every table, what each column stores, and the relationships between tables, without any database syntax or technical implementation details.

---

### Prompt 10.2 — API Endpoint Catalog Description

You are an API product manager describing all the API endpoints needed for authentication, user management, dataset management, and application management in plain English.

The Authentication category contains endpoints for creating a new account, logging in with email and password, logging out and invalidating the current session, refreshing an expired access credential using the refresh credential, requesting a password reset link by email, submitting a new password using a reset token, verifying an email address using a verification link, sending an OTP to a phone number, verifying an OTP entered by the user, beginning the two-factor authentication setup process, confirming the two-factor setup by verifying the first generated code, verifying a two-factor code during login, disabling two-factor authentication on an account, listing all active sessions for the current user, revoking a specific session by its identifier, and revoking all sessions except the current one.

The User Management category contains endpoints for retrieving the current user's profile, updating the current user's profile details, changing the current user's password by providing the existing password and a new one, uploading a new profile photo, retrieving the current user's notification preferences, and updating those preferences.

The Farm Management category contains endpoints for retrieving the profile of a specific farm, updating the farm's profile details, listing all team members of a farm, inviting a new member to a farm by email, changing the role of an existing team member, and removing a team member from a farm.

The Dataset Management category contains endpoints for listing all datasets belonging to a farm with support for filtering and pagination, creating a new dataset by submitting the configuration from the creation wizard, retrieving the full details and schema of a specific dataset, updating the name, description, or other metadata of a dataset, deleting a dataset permanently, importing data into a dataset from a file, retrieving the data rows of a dataset with support for filtering and pagination, adding a single new row to a dataset, updating an existing row, deleting a specific row, listing all version history entries for a dataset, creating a manual version checkpoint for a dataset, retrieving a historical snapshot of a dataset at a specific version, rolling back a dataset to a previous version, exporting a dataset in a chosen format, sharing a dataset with specific users or roles, and browsing the public dataset library.

The Application Management category contains endpoints for listing all available applications in the marketplace with filtering and search, retrieving the full detail page information for a specific application, installing an application for a farm, uninstalling an application from a farm, listing all applications currently installed by a farm, updating the configuration of an installed application, toggling an installed application between enabled and disabled without uninstalling, listing all custom applications created by a farm, creating a new custom application, updating the definition of a custom application, and deploying a custom application to make it live.

Every endpoint follows consistent standards. All responses include a success indicator, a data object containing the returned information, and a metadata object for paginated responses containing the total count, the current page cursor, and the next page cursor. All error responses include a success indicator set to false, a machine-readable error code, and a human-readable message suitable for displaying to the user. All date and time values in requests and responses use the international standard format with timezone information. Authenticated endpoints require a valid access credential to be included in the request. Rate limits apply based on the subscription plan tier with higher limits for paid plans.

Output a complete plain-English catalog of every API endpoint organized by category, describing what each endpoint accepts, what it returns, and what errors it can produce, without any technical syntax or implementation details.

---

## IMPLEMENTATION PRIORITY ROADMAP

| Priority Level | Feature | Estimated Effort | Reason |
|---|---|---|---|
| Must Have | Login page with JWT authentication | One week | Entry point for all users |
| Must Have | Three-step registration wizard | One week | New user acquisition |
| Must Have | Forgot and reset password flow | Three days | User account recovery |
| Must Have | Role-based access control | Three days | Multi-user team support |
| Must Have | Four-step dataset creation wizard | Two weeks | Core platform capability |
| Should Have | Phone OTP verification | Two days | Security and fraud prevention |
| Should Have | Two-factor authentication | Three days | Enterprise security requirement |
| Should Have | Dataset versioning and history | One week | Data governance requirement |
| Should Have | Application marketplace and install | Two weeks | Platform growth and extensibility |
| Could Have | Custom application builder | Three weeks | Advanced user capability |
| Could Have | Social login via Google and Microsoft | Three days | Ease of user onboarding |
| Could Have | Federated dataset sharing across farms | Two weeks | Cooperative data collaboration |

---

## QUICK REFERENCE SUMMARY

| Page or Flow | User Starts | System Ends |
|---|---|---|
| Login | Enters email and password | Redirects to role-appropriate dashboard |
| Forgot Password | Enters email address | Receives reset link valid for one hour |
| Reset Password | Enters new password via link | Password updated, all sessions invalidated |
| Register Step 1 | Enters personal account details | Email checked, phone OTP verified |
| Register Step 2 | Enters farm details | Farm profile stored in session |
| Register Step 3 | Selects plan and accepts terms | Account created, welcome email sent, trial starts |
| Create Dataset | Completes four-step wizard | Dataset created, schema defined, data imported |
| Install App | Clicks Install on marketplace | Permissions accepted, dataset connected, widget placed |
| Create Custom App | Completes five-step builder | Logic defined, sandbox tested, app deployed |
| Enable 2FA | Scans QR code and verifies | Two-factor enabled, backup codes generated |
| Manage Sessions | Views active device list | Can revoke any or all other sessions |

---

Document Version 3.0 — Pure Narrative Format with Zero Code
Module Coverage: Authentication, Registration, Dataset Management, Application Management
Part of: AI Dairy Farm Management System — Full Product Prompt Engineering Suite
Intended For: Product Managers, UX Designers, Frontend Engineers, Backend Engineers, QA Teams

