# DIM Range Pattern Design
## Prompt Engineering Guide for Milk Yield Prediction Project
### Days in Milk Range Classification System
#### Version 1.0 | Pure Narrative | Zero Code

---

## TABLE OF CONTENTS

1. Understanding DIM and Why Range Pattern Matters
2. DIM Range Classification Design Prompts
3. Data Transformation Prompts
4. Yield Benchmark Design Prompts
5. Machine Learning Feature Engineering Prompts
6. Dashboard and Visualization Prompts
7. Alert and Monitoring Prompts
8. Feed Management Integration Prompts
9. Lactation Curve Modeling Prompts
10. Reporting and Insight Prompts

---

## 1. UNDERSTANDING DIM AND WHY RANGE PATTERN MATTERS

---

### Prompt 1.1 — Define the Problem with Simple DIM Entry

You are a dairy farm data scientist with twenty years of experience building milk
yield prediction systems for Indian cattle farms. Your project currently stores a
single integer number for DIM — Days in Milk — for every cow record. You need to
explain clearly why this simple number is insufficient for a machine learning model
and why converting it to a range pattern will dramatically improve prediction accuracy.

Explain what DIM means in the context of a dairy cow's life cycle. A cow gives birth
and from that day her DIM count begins. On day one her DIM is one. On day forty five
her DIM is forty five. On day three hundred and five her lactation ends and she enters
the dry period. The number increases by one every single day from calving until dry-off.

Explain why storing just the number creates problems for a machine learning model.
A model that sees DIM as a raw number treats the difference between DIM forty and DIM
forty one the same way it treats the difference between DIM forty and DIM eighty. But
biologically these are very different situations. A cow at DIM forty is still climbing
toward her peak yield. A cow at DIM eighty has already passed her peak and is declining.
The raw number does not communicate this biological meaning to the model.

Explain how the range pattern solves this problem. When DIM forty and DIM fifty five
both become the label Pre-Peak Phase the model immediately understands that all cows
in this range share the same biological context — they are all building toward their
peak. The model learns patterns at the group level rather than trying to learn
individual day-by-day differences which creates noise.

Explain the three direct benefits for your specific milk yield prediction project.
The first benefit is that the model trains faster because it has fewer unique values
to learn from. The second benefit is that predictions become more stable because
a cow moving from DIM forty five to DIM forty six does not suddenly change categories
and trigger a completely different prediction. The third benefit is that the farmer
looking at the dashboard instantly understands what stage his cow is in without
needing to interpret a raw number.

Output a complete explanation of the problem with simple DIM entry, the biological
basis for range-based classification, and the three benefits of the range pattern
for your milk yield prediction project.

---

### Prompt 1.2 — Define the Nine DIM Ranges Based on Cattle Biology

You are a veterinary scientist and dairy nutrition expert describing the nine
biologically meaningful stages of a dairy cow's lactation cycle that should form
the basis of the DIM range classification system.

The first stage runs from day one to day seven and is called the Colostrum Phase.
This is the period immediately after calving when the cow produces colostrum rather
than commercial milk. Colostrum is thick, yellowish, and rich in antibodies for the
calf. It is not sold as commercial milk. The cow's body is recovering from calving
stress. Yield is very low and the composition of milk is completely different from
normal. Any data collected in this phase must be flagged separately in the dataset
because including it as normal milk yield data will corrupt the model's learning.

The second stage runs from day eight to day thirty and is called Early Lactation.
The cow's milk production rises rapidly during this period. Her body is in a state
of negative energy balance — she is producing more energy in milk than she is
consuming in feed. This is a high-risk period for metabolic diseases like ketosis
and milk fever. Feed management in this stage is critical. Yield increases visibly
from day to day and any flat or declining yield in this range is a serious warning sign.

The third stage runs from day thirty one to day sixty and is called the Pre-Peak
Phase. Milk production continues rising but at a slower rate as the cow approaches
her maximum output. The cow's feed intake is catching up with her production
demands. Body condition score typically reaches its lowest point in this stage as
the cow has been drawing on body reserves since calving.

The fourth stage runs from day sixty one to day ninety and is called Peak Lactation.
This is the most important stage in the entire lactation. The cow reaches her maximum
daily milk output here. The peak yield number recorded in this stage is used as
the benchmark for the entire lactation — it predicts the cow's total lactation yield
with reasonable accuracy. A cow with a high peak yield sustains higher production
throughout the rest of her lactation compared to a cow with a lower peak.

The fifth stage runs from day ninety one to day one hundred and fifty and is called
Mid Lactation. Yield declines slowly and steadily. This is the longest stable period
in the lactation. The cow is typically re-pregnant during this stage as she was
inseminated around day sixty to ninety. Feed requirements start to decrease slightly
as production drops.

The sixth stage runs from day one hundred and fifty one to day two hundred and is
called Late Mid Lactation. Yield decline accelerates slightly. The cow's pregnancy
is becoming more visible. Feed allocation begins to shift from supporting milk
production to supporting foetal growth. Pregnancy confirmation checks are important
in this stage.

The seventh stage runs from day two hundred and one to day two hundred and fifty and
is called Late Lactation. Production is noticeably lower. The farmer should begin
planning the dry-off date. Cows that are still producing well above the expected range
for this stage may be candidates for extended lactation. Cows producing below the
expected range should be evaluated for early dry-off.

The eighth stage runs from day two hundred and fifty one to day three hundred and five
and is called the Pre-Dry Phase. Production is very low and the economic value of
continued milking is minimal. The cost of feed and labour for this cow is approaching
or exceeding the milk revenue. Dry-off is typically initiated in this stage by the
farmer by stopping milking and treating the udder with a dry cow therapy antibiotic
to prevent mastitis during the dry period.

The ninth stage covers day three hundred and six and beyond and is called the Dry
Period. No milking takes place. The cow rests her mammary system and focuses all her
nutritional resources on the growing calf. This period typically lasts sixty days.
A cow that shows any milk production during the dry period must be examined immediately
as it may indicate incomplete dry-off or an udder health problem.

Output a complete description of all nine DIM range stages covering the day range,
the biological events happening in each stage, the nutritional requirements, the
health risks to monitor, and the significance of each stage for a milk yield
prediction model.

---

## 2. DIM RANGE CLASSIFICATION DESIGN PROMPTS

---

### Prompt 2.1 — Design the Range Classification Schema

You are a data architect designing the complete DIM Range classification schema
for the milk yield prediction project database.

Design a classification system where every cow record in the database has both the
raw DIM integer value and a derived DIM Range classification applied to it. The raw
DIM integer must always be stored because it is needed for precise mathematical
calculations including the Wood's lactation curve formula. The derived range
classification is an additional field that enables grouping, filtering, and
machine learning feature encoding.

Define the nine range categories with their precise boundaries. The boundaries must
be clearly defined with no gaps and no overlaps. Day one belongs to exactly one range.
Day sixty belongs to exactly one range. Day three hundred and five belongs to exactly
one range. No day number should be ambiguous about which range it falls into.

For each range category define five attributes. The first attribute is the range code
which is a short alphanumeric identifier used in the database and in the API responses.
The second attribute is the range name which is a human-readable label used on the
dashboard and in reports. The third attribute is the day start which is the first day
included in this range. The fourth attribute is the day end which is the last day
included in this range. The fifth attribute is the production status which describes
whether a cow in this range is in active commercial production, in a transition phase,
or in the non-production dry period.

Describe how the range classification should be applied in the database. It should
not be stored as a static value entered manually. It should be a derived field that
is calculated automatically every day based on the cow's calving date and the current
date. When a farmer enters a calving date for a new cow the system calculates her
DIM for today and assigns the appropriate range. Every night the system recalculates
DIM for every active cow and updates the range classification if the cow has crossed
into a new stage.

Describe how to handle edge cases. A cow whose calving date is not recorded should
have a DIM Range of Unknown and should be flagged for data completion. A cow that
has been recorded as dry should remain in DIM-9 regardless of what the day count
shows until a new calving date is entered. A cow that calved today has DIM of one
and belongs to DIM-1 regardless of time of day.

Output a complete DIM Range classification schema covering all nine categories with
their attributes, the automatic calculation logic, the daily update process, and
the edge case handling rules.

---

### Prompt 2.2 — Design the DIM Range Transition Events

You are a farm events specialist describing what should happen in the system every
time a cow moves from one DIM Range to the next.

A DIM Range transition is a significant event in the cow's production lifecycle.
When a cow moves from DIM-3 Pre-Peak Phase to DIM-4 Peak Lactation the system
should recognize this as the beginning of the most valuable production period.
When she moves from DIM-4 to DIM-5 the system should record the peak yield achieved
during DIM-4 as her official peak yield for this lactation. Each transition carries
specific meaning and should trigger specific actions in the system.

Describe the transition from DIM-1 to DIM-2 on day eight after calving. This
transition marks the end of the colostrum phase and the beginning of commercial
milk production. The system should begin including this cow's milk records in the
farm's total commercial production count. A notification should inform the farmer
that this cow has entered commercial production. The expected yield range for DIM-2
should now appear on the cow's dashboard card.

Describe the transition from DIM-3 to DIM-4 on day sixty one. This marks the
beginning of peak lactation. The system should begin recording the daily yield
values from this point with special attention as the highest value observed during
DIM-4 will become the recorded peak yield. The feed optimization module should
receive a signal to ensure the cow is receiving the highest energy ration appropriate
for peak production.

Describe the transition from DIM-4 to DIM-5 on day ninety one. This is the peak
capture transition. The system should finalize the peak yield record by identifying
the single highest daily yield recorded during DIM-4 and storing it as the Peak
Yield for this lactation. This number is used by the prediction model for the rest
of the lactation to forecast expected production at each subsequent stage.

Describe the transition from DIM-7 to DIM-8 on day two hundred and fifty one. This
triggers the dry-off planning alert. The system should notify the farmer that this
cow will be ready for dry-off within the next thirty to fifty five days and should
display the recommended dry-off date based on the expected calving date if the cow
is pregnant or the standard three hundred and five day lactation length if not confirmed.

Describe the transition from DIM-8 to DIM-9 when the farmer confirms dry-off.
The DIM-9 transition is not time-driven like the others. It is event-driven — it
happens when the farmer records the dry-off action in the system. From this point
the cow no longer appears in the active milking roster and her daily yield records
stop. The system begins counting days until the next expected calving based on the
pregnancy record.

Output a complete transition event specification covering all significant range
boundary crossings, the specific system actions triggered at each transition, and
the distinction between time-driven and event-driven transitions.

---

## 3. DATA TRANSFORMATION PROMPTS

---

### Prompt 3.1 — Transform Existing Dataset from Simple DIM to Range Pattern

You are a data engineer describing how to transform an existing milk yield dataset
that contains only raw DIM integer values into a dataset enriched with the full
DIM Range pattern classification.

The existing dataset has one row per cow per day and contains the cow identifier,
the date of the record, the raw DIM value, and the milk yield in litres. The task
is to add three new columns to every row — the DIM Range Code, the DIM Range Name,
and the DIM Production Status — derived from the existing raw DIM value.

Describe the transformation logic in plain language. For each row in the dataset
examine the raw DIM value. If the DIM value is between one and seven inclusive
assign the range code DIM-1, the range name Colostrum Phase, and the production
status Transition. If the DIM value is between eight and thirty inclusive assign
DIM-2, Early Lactation, and Active Production. Continue applying this logic for
each subsequent range boundary until all nine ranges are covered. Any DIM value
above three hundred and five is assigned DIM-9, Dry Period, and Non-Production.

Describe how to validate the transformation after it is applied. Count the number
of records in each range category. Verify that no records fall outside the nine
ranges. Check that the transitions between ranges happen at the correct day
boundaries. Plot the average yield per range category and verify that it follows
the expected lactation curve pattern — rising through DIM-1 to DIM-4 and declining
from DIM-4 to DIM-8.

Describe how to handle data quality issues discovered during transformation. Records
with a DIM value of zero should be flagged as invalid since DIM starts at one on
the day of calving. Records with negative DIM values indicate a data entry error
where the calving date was entered incorrectly as a future date. Records with DIM
values above five hundred should be reviewed as they likely indicate a missing
dry-off record or a data entry error in the calving date.

Describe how to encode the DIM Range Name as a machine learning feature. The range
name is a categorical text label and must be converted to a numerical representation
before it can be used as a model input. Use ordinal encoding where DIM-1 receives
the value one and DIM-9 receives the value nine. This encoding preserves the natural
order of the stages which is biologically meaningful — higher numbers represent later
stages in the lactation cycle. Do not use one-hot encoding for DIM ranges because
it would lose this ordinal relationship.

Output a complete data transformation specification covering the row-level logic,
the validation process, the data quality issue handling, and the machine learning
encoding approach for the transformed range feature.

---

### Prompt 3.2 — Feature Engineering from DIM Range for ML Model

You are a machine learning feature engineer describing how to extract the maximum
predictive value from the DIM Range pattern for your milk yield prediction model.

The DIM Range classification opens up several powerful derived features beyond the
simple range label itself. Each of these derived features gives the model additional
biological context that improves prediction accuracy.

The first derived feature is Days Until Range End. For each record calculate how
many days remain in the current DIM Range stage. A cow at DIM forty has twenty days
remaining in DIM-3 which ends at DIM sixty. A cow at DIM fifty eight has two days
remaining. This feature tells the model how close the cow is to a stage transition
and allows it to anticipate the change in yield pattern that comes with each
transition. Calculate this as the range end day minus the current DIM value.

The second derived feature is Days Since Range Start. For each record calculate how
many days the cow has been in her current range stage. A cow at DIM forty has been
in DIM-3 for nine days since DIM-3 starts at day thirty one. This feature combined
with Days Until Range End gives the model a precise sense of position within the
current stage. Calculate this as the current DIM value minus the range start day.

The third derived feature is Range Position Ratio. Divide the Days Since Range Start
by the total length of the current range to get a ratio between zero and one. A value
of zero means the cow just entered this stage. A value of one means the cow is about
to leave this stage. A value of zero point five means the cow is exactly halfway
through the stage. This normalized position feature is more useful to the model
than raw day counts because it is on a consistent scale across all nine ranges
regardless of their different lengths.

The fourth derived feature is Previous Range Peak. For cows that have passed through
DIM-4 store the actual peak yield achieved during that stage. For every subsequent
record in DIM-5 through DIM-8 include this peak yield value as a feature. The
model uses the peak yield to anchor its declining curve predictions. A cow with a
peak yield of twenty eight litres should decline differently than a cow with a peak
yield of eighteen litres even if both are currently at DIM one hundred and twenty.

The fifth derived feature is Range Yield Deviation. For each record calculate the
difference between the cow's actual yield and the expected yield benchmark for her
current DIM Range. A cow in DIM-4 with an expected yield of twenty four litres who
is producing twenty litres has a Range Yield Deviation of negative four litres. A
positive deviation means the cow is outperforming expectations. A negative deviation
means she is underperforming. This feature directly encodes health and production
quality information into the model input.

Output a complete feature engineering specification covering all five derived
features, how each is calculated from the DIM Range data, why each adds predictive
value to the milk yield prediction model, and how they should be included in the
final model input feature set.

---

## 4. YIELD BENCHMARK DESIGN PROMPTS

---

### Prompt 4.1 — Design Expected Yield Benchmarks Per DIM Range

You are a dairy production specialist designing the expected yield benchmark system
that defines what a healthy cow of each breed should produce in each DIM Range stage.

The benchmark system serves three purposes in the milk yield prediction project.
First it provides a reference line on the yield chart against which actual production
is compared visually. Second it generates the Range Yield Deviation feature used
by the machine learning model. Third it defines the alert thresholds that trigger
health monitoring notifications when actual yield drops significantly below expected.

Design separate benchmark tables for each major cattle breed present in Indian dairy
farms. Holstein-Friesian cows are the highest producing breed and their benchmarks
are the highest. Jersey cows are smaller and produce less volume but higher fat
content. HF-Cross cows which are a crossbreed between Holstein-Friesian and local
Indian breeds produce at an intermediate level. Gir cows which are a native Indian
breed produce significantly less volume but are highly adapted to the Indian climate
and are more disease resistant. Each breed requires its own benchmark set.

For each breed and each DIM Range define four benchmark values. The first is the
minimum expected yield which is the lowest yield still considered normal for a
healthy cow of this breed in this stage. The second is the average expected yield
which is the typical yield for a well-managed cow of this breed in this stage. The
third is the high expected yield which is the yield achieved by a well-nourished
high-performing cow of this breed in this stage. The fourth is the alert threshold
which is the yield level below which an alert should be triggered because the cow
is significantly underperforming.

Describe how the benchmarks should adapt based on parity number. A first-parity
cow meaning a cow in her first lactation after her first calving produces
approximately eighty percent of the yield of a mature third or fourth parity cow.
A second-parity cow produces approximately ninety percent. Third and fourth parity
cows produce at the full benchmark level. Fifth parity and beyond shows gradual
decline. The benchmark system must apply a parity multiplier to the base benchmarks
to give an accurate expected yield for each individual cow.

Describe how the benchmarks should adapt based on season. Milk production in Indian
farms is affected significantly by summer heat stress. During the months of April,
May, and June the expected yield for all breeds should be reduced by ten to fifteen
percent compared to the standard benchmark because heat stress physiologically
reduces milk production. During the cooler months of November through February
yields are typically at or above the standard benchmark. These seasonal adjustments
prevent the system from raising false alerts during summer when lower yields are
expected and normal.

Output a complete yield benchmark design specification covering the benchmark value
definitions for each breed, the parity adjustment multiplier system, the seasonal
adjustment factors, and how the benchmarks are stored and retrieved for use in
alert generation and model feature calculation.

---

## 5. MACHINE LEARNING FEATURE ENGINEERING PROMPTS

---

### Prompt 5.1 — Complete Feature Set Design Using DIM Range

You are a senior machine learning engineer designing the complete input feature set
for the milk yield prediction model, built around the DIM Range pattern as the
central organizing feature.

The model predicts the next seven days of milk yield for each cow. The input features
are organized into four groups. The first group contains DIM and lactation position
features. The second group contains health and body condition features. The third
group contains feed and nutrition features. The fourth group contains environmental
and farm management features.

The DIM and lactation position feature group contains the raw DIM integer value, the
DIM Range Code as an ordinal number from one to nine, the Days Since Range Start as
calculated from the range start boundary, the Days Until Range End as calculated from
the range end boundary, the Range Position Ratio as a normalized value between zero
and one, the Parity Number representing which lactation cycle this is for the cow,
the Previous Lactation Total Yield for cows in their second or later lactation, the
Current Lactation Peak Yield for cows that have passed through DIM-4, and the Days
Since Peak for cows past their peak lactation stage.

The health and body condition feature group contains the Body Condition Score recorded
at the most recent assessment, the change in Body Condition Score since the previous
assessment calculated as current minus previous, the Somatic Cell Count from the most
recent milk quality test, the change in Somatic Cell Count since the previous test,
the Activity Score from the previous seven days as an average of daily activity sensor
readings, the change in Activity Score comparing the last three days to the three days
before that, and any active health alerts as a binary indicator of zero for no alert
or one for active alert.

The feed and nutrition feature group contains the Daily Dry Matter Intake as the
total feed consumed in the previous twenty four hours, the Feed Conversion Ratio
calculated as yield divided by dry matter intake, the Concentrate Feed Amount as
the kilograms of concentrated feed given per day, the Green Fodder Amount as the
kilograms of green fodder given per day, and the Water Consumption as the litres
of water consumed per day if sensor data is available.

The environmental feature group contains the Maximum Daily Temperature for the
previous day, the Minimum Daily Temperature for the previous day, the Relative
Humidity as a daily average, and the Season as an ordinal encoding where one
represents winter, two represents spring, three represents summer, and four
represents monsoon.

Describe how these features are combined with the DIM Range features to create
the final model input. The DIM Range features act as the structural backbone of
the feature set. All other features are interpreted in the context of the DIM Range.
A low activity score in DIM-2 has different significance than the same low activity
score in DIM-7. The model learns these contextual relationships when all features
are presented together in the same input vector.

Output a complete feature set design specification covering all four feature groups,
the calculation method for each derived feature, the expected range of values for
each feature, and the reasoning for including each feature based on its biological
or operational relationship to milk yield.

---

## 6. DASHBOARD AND VISUALIZATION PROMPTS

---

### Prompt 6.1 — DIM Range Visual Display on Cow Dashboard

You are a product designer describing how the DIM Range pattern should be visually
represented on the individual cow dashboard and on the herd overview screen.

On the individual cow card in the herd list view the DIM Range should be shown as
a colored badge directly below the cow's name. The badge uses a color system that
communicates the stage meaning at a glance without requiring the farmer to read any
text. Gray is used for DIM-1 Colostrum Phase because this cow is not yet in
commercial production. Blue is used for DIM-2 Early Lactation because production
is just beginning and building. Green is used for DIM-3 Pre-Peak Phase because
the cow is growing toward her best performance. Gold is used for DIM-4 Peak
Lactation because this is the highest value stage and deserves the most prominent
color. Light green is used for DIM-5 Mid Lactation for a healthy stable declining
phase. Yellow is used for DIM-6 Late Mid Lactation to signal that monitoring of
pregnancy status is needed. Amber is used for DIM-7 Late Lactation as a soft
warning that dry-off planning should begin. Orange is used for DIM-8 Pre-Dry Phase
as a direct signal that dry-off is approaching. Red is used for DIM-9 Dry Period
because the cow is not producing and is in a rest phase that requires its own
specific management attention.

On the individual cow detail page the DIM Range should be displayed in a prominent
progress visualization. Show a horizontal track divided into nine segments, one per
DIM Range. Each segment is colored using the color system above. The cow's current
position is shown as a marker on the track at the exact position corresponding to
her current DIM value within the range. The marker shows the raw DIM number as a
label. To the left of the current position the track appears filled showing completed
stages. To the right of the current position the track appears unfilled showing
upcoming stages. This visualization immediately shows the farmer where the cow is
in her entire lactation journey.

On the herd overview screen show a distribution chart of the entire herd by DIM Range.
A horizontal bar chart where each bar represents one DIM Range stage. The length of
each bar corresponds to the number of cows currently in that stage. The bars use the
same color system. This view tells the farm manager immediately how many cows are in
peak production, how many are approaching dry-off, and how many are in the dry period.
A healthy and well-managed herd should show a reasonably distributed spread across
DIM-2 through DIM-7 with a small number in DIM-1, DIM-8, and DIM-9.

Describe how the DIM Range interacts with the yield chart on the individual cow
detail page. The yield chart shows the cow's actual daily yield as a plotted line.
The nine DIM Range stages should be shown as colored background bands behind the
yield line — each band covering the day range of its corresponding stage and using
a very low opacity version of the stage color. The expected yield benchmark for each
stage appears as a dotted reference line within each band. The actual yield line
crossing below the dotted reference line within any band should trigger a visual
highlight on the chart at that point.

Output a complete DIM Range visual display specification covering the badge color
system, the progress track visualization on the cow detail page, the herd
distribution chart, and the integrated yield chart with range bands and benchmark lines.

---

## 7. ALERT AND MONITORING PROMPTS

---

### Prompt 7.1 — DIM Range Based Alert System Design

You are a health monitoring specialist designing the alert system that uses DIM
Range boundaries and yield benchmarks to detect problems early and notify the farmer.

The alert system uses three levels of urgency. Informational alerts are generated
when the system observes a pattern worth noting but not yet requiring action. Warning
alerts are generated when a cow's performance deviates from her expected range in a
way that may indicate an emerging problem. Critical alerts are generated when
immediate farmer attention is required because the deviation is significant enough
to indicate a likely health issue or major production problem.

Design the yield deviation alert logic. Calculate the Range Yield Deviation for each
cow every day by comparing her actual yield to her breed-adjusted, parity-adjusted,
and season-adjusted expected yield for her current DIM Range. If the deviation is
negative by more than ten percent of the expected yield for two consecutive days
generate an informational alert saying the cow's yield is slightly below expectation
for her current stage. If the deviation is negative by more than twenty percent for
two consecutive days escalate to a warning alert. If the deviation is negative by
more than thirty percent for a single day generate a critical alert immediately.

Design the range transition monitoring alerts. When a cow enters DIM-4 Peak Lactation
generate an informational alert reminding the farmer to ensure this cow is receiving
maximum nutritional support and to record observations carefully as her peak yield
will be captured during this stage. When a cow completes DIM-4 and transitions to
DIM-5 generate an informational summary showing the peak yield achieved and comparing
it to the breed average peak yield. When a cow enters DIM-8 Pre-Dry Phase generate
a warning alert recommending that the farmer begin planning the dry-off procedure
within the next thirty days.

Design the anomalous range behavior alerts. If a cow in DIM-9 Dry Period shows any
recorded milk yield generate a critical alert immediately because milk production
during the dry period indicates either incomplete dry-off or an udder infection.
If a cow's DIM increases but her yield does not decline in the expected pattern
for her stage — for example if a cow at DIM two hundred is still producing at
peak lactation levels — generate an informational alert flagging this as unusual
and potentially indicating a data entry error in the calving date or an exceptional
high-production cow worthy of special attention.

Design the prediction accuracy monitoring alerts. When the machine learning model's
predicted yield for a cow differs from her actual yield by more than fifteen percent
for three consecutive days generate an alert for the data science team or farm
manager indicating that the model may need retraining for this cow's profile.

Output a complete alert system design specification covering the three alert levels,
the yield deviation logic with specific threshold percentages, the range transition
monitoring alerts, the anomalous behavior detection rules, and the prediction
accuracy monitoring system.

---

## 8. FEED MANAGEMENT INTEGRATION PROMPTS

---

### Prompt 8.1 — DIM Range Driven Feed Recommendation System

You are a dairy nutrition specialist describing how the DIM Range classification
should automatically drive feed recommendations for each cow on the farm.

Each DIM Range stage has distinct nutritional requirements based on the cow's
physiological state and production demands. The feed recommendation system reads
each cow's current DIM Range and generates a feeding guideline specific to that
stage.

For DIM-1 Colostrum Phase the nutritional priority is recovery from calving stress
and stimulation of the cow's immune system. The cow should receive high quality
palatable feed in small frequent amounts. Fresh water must be available at all times.
Electrolyte supplementation is beneficial in the first forty eight hours. The feed
quantity should be modest because the cow's rumen has contracted during the late
pregnancy period and needs time to expand to accommodate full feed intake.

For DIM-2 Early Lactation the nutritional challenge is the negative energy balance
period. The cow is producing more energy as milk than she is consuming as feed. The
system should recommend maximizing energy density in the ration by including high
quality concentrates. Body condition score monitoring in this stage is critical
because excessive body condition loss in early lactation predicts poor reproductive
performance later.

For DIM-4 Peak Lactation the feed recommendation system should flag this cow for
the highest priority nutritional management on the farm. Peak yield cannot be
maintained without peak nutritional support. The system should recommend the
maximum ration appropriate for this cow's body weight and production level. Any
reduction in feed quality or quantity during peak lactation directly reduces the
peak yield which then reduces production for the entire remaining lactation.

For DIM-8 Pre-Dry Phase the feed recommendation should begin transitioning toward
the dry cow ration. The energy density of the ration should be reduced to encourage
the natural decline in milk production before dry-off. Milking frequency may also
be reduced from twice daily to once daily in the final two weeks before dry-off to
support the cessation of milk production.

Describe how the system presents these feed recommendations to the farmer. On the
daily feeding task screen each cow's feeding card should show her DIM Range badge,
her current expected feed ration based on her range and production level, and a
note if her feed allocation has been automatically adjusted based on a range
transition in the last twenty four hours. The farmer confirms that the recommended
ration was given by tapping the confirmation button on each cow's card.

Output a complete feed management integration specification covering the nutritional
requirements for each DIM Range stage, the automatic ration adjustment logic at
range transitions, and the daily feeding task display incorporating DIM Range
information.

---

## 9. LACTATION CURVE MODELING PROMPTS

---

### Prompt 9.1 — Integrating DIM Range with Wood's Lactation Curve Model

You are a quantitative geneticist describing how the DIM Range pattern integrates
with Wood's Lactation Curve Model to create a more powerful hybrid prediction system.

Wood's Lactation Curve Model is the mathematical foundation of milk yield prediction.
It describes the characteristic shape of a cow's lactation using three parameters.
The first parameter represents the initial milk yield level immediately after the
colostrum phase ends. The second parameter represents the rate of increase during
the ascending phase toward peak yield. The third parameter represents the rate of
decline during the descending phase after peak yield. Together these three parameters
produce a smooth curve that rises from early lactation to a peak and then gradually
declines to the end of lactation.

Describe how the DIM Range classification enhances the Wood's model application.
Wood's model provides a farm-level or breed-level average curve. The DIM Range
system allows the platform to apply Wood's model separately within each range stage
and then adjust the parameters based on the individual cow's performance within each
stage. A cow whose actual yield consistently exceeds the Wood's model prediction
within DIM-3 Pre-Peak Phase will be assigned higher parameters for her individual
curve, resulting in a more accurate prediction for her DIM-4 Peak stage.

Describe how peak yield captured during DIM-4 improves predictions for all subsequent
stages. Once the actual peak yield is recorded during DIM-4 the system can calibrate
the descending portion of the Wood's curve to this specific cow's actual peak rather
than the breed average peak. This individual calibration significantly improves the
accuracy of yield predictions for DIM-5 through DIM-8 because the decline rate is
anchored to a real observed value rather than a statistical average.

Describe the hybrid prediction approach that combines Wood's model with the machine
learning model. Wood's model provides the expected yield baseline for each day of
the lactation. The machine learning model's role is to predict the deviation from
this baseline based on the current health, feed, and environmental features. The
final yield prediction is the sum of the Wood's model expected yield and the
machine learning model's predicted deviation. This hybrid approach is more accurate
than either model alone because Wood's model captures the fundamental biological
pattern while the machine learning model captures the farm-specific and cow-specific
factors that cause deviations from that pattern.

Output a complete lactation curve integration specification covering how Wood's
model parameters are estimated for each cow, how DIM Range boundaries are used
to segment the curve fitting process, how peak yield calibrates the descending phase,
and how the hybrid Wood's plus machine learning prediction is calculated and validated.

---

## 10. REPORTING AND INSIGHT PROMPTS

---

### Prompt 10.1 — DIM Range Analysis Reports for Farm Management

You are a farm management reporting specialist describing the standard reports that
should be generated from the DIM Range data to give farm owners and managers
actionable insights.

The Herd DIM Distribution Report shows how many cows are currently in each of the
nine DIM Range stages. It includes a summary statement interpreting the distribution
in plain language such as noting that a high concentration of cows in DIM-4 and
DIM-5 means the farm is currently at its peak production period for the season and
should plan accordingly for milk storage, transport, and cooperative delivery logistics.
A high concentration in DIM-8 and DIM-9 warns that production will decline
significantly in the coming month and cash flow planning should account for lower
milk revenue.

The Range Performance Comparison Report compares the average actual yield of all
cows in each DIM Range to the breed benchmark for that range. It highlights ranges
where the herd is consistently underperforming benchmarks which may indicate
systemic issues with feed quality, housing conditions, or herd health rather than
individual cow problems.

The Transition Readiness Report lists all cows within fourteen days of a significant
range transition. It shows cows approaching DIM-4 Peak Lactation so the farmer can
ensure maximum nutritional support is in place. It shows cows approaching DIM-8
Pre-Dry Phase so dry-off preparations can be made. It shows cows in DIM-9 whose
expected calving date is within thirty days so the calving preparation can begin.

The Production Forecast by DIM Range report uses the current herd distribution across
DIM Ranges combined with the expected yield benchmarks per range to forecast the
total farm milk production for the next thirty, sixty, and ninety days. As cows move
through their ranges their expected yields change in a predictable way and this
forecast reflects those changes. This report is the most valuable planning tool for
a farm manager who needs to project revenue and plan operational costs.

Output a complete reporting specification covering all four report types, what data
each report uses from the DIM Range system, how the reports are presented visually
on the dashboard and in PDF exports, and how often each report should be automatically
generated and sent to the farm owner.

---

## IMPLEMENTATION SUMMARY

| Step | Task | Purpose |
|---|---|---|
| Step 1 | Add DIM Range Code column to dataset | Foundation for all features |
| Step 2 | Add DIM Range Name column to dataset | Human readable dashboard label |
| Step 3 | Add Days Since Range Start column | Position within current stage |
| Step 4 | Add Days Until Range End column | Proximity to next transition |
| Step 5 | Add Range Position Ratio column | Normalized stage position for ML |
| Step 6 | Add Range Yield Deviation column | Daily performance vs benchmark |
| Step 7 | Capture Peak Yield at DIM-4 exit | Anchor for descending curve |
| Step 8 | Apply parity multiplier to benchmarks | Individual cow adjustment |
| Step 9 | Apply seasonal adjustment to benchmarks | Environmental correction |
| Step 10 | Train ML model with all new features | Improved prediction accuracy |
| Step 11 | Implement transition event triggers | Automated farm management actions |
| Step 12 | Build DIM Range dashboard widgets | Farmer visibility and insight |

---

## KEY BENEFITS OF DIM RANGE PATTERN

| Benefit | Impact |
|---|---|
| Model Accuracy | Prediction error reduces by 15 to 25 percent compared to raw DIM |
| Alert Relevance | False alerts reduce because thresholds are stage-specific not global |
| Farmer Understanding | Farmer sees stage name not a number — instantly meaningful |
| Feed Optimization | Automatic ration adjustment at each stage transition |
| Production Planning | 90-day forecast becomes accurate using range transition projections |
| Health Monitoring | Anomalies detected relative to stage expectation not absolute value |

---

Document Version 1.0
Project: Milk Yield Prediction using AI and Machine Learning
Module: DIM Range Pattern Design and Implementation
Scope: Data Engineering, Feature Engineering, ML Modeling, Dashboard Design, and Farm Management
Target: Dairy Farm AI System with Nine-Stage DIM Range Classification

