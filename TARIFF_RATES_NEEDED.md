# 📊 Kahramaa Tariff Rates - Data Needed

## ⚠️ Current Status

The website structure shows the categories, but **I need the specific tariff rates (QAR per kWh)** for each facility type from the Kahramaa tariff page.

---

## 📋 Required Information

To properly integrate the correct tariff rates into the savings calculator, I need the **exact rates in QAR per kWh** for each of the following categories:

### **Current Categories on Kahramaa Site:**

1. **🥉 Villa (Residential)**
   - Need rates: [Insert QAR/kWh rates here]

2. **🏢 Flat (Residential)**
   - Need rates: [Insert QAR/kWh rates here]

3. **🏪 Commercial**
   - Need rates: [Insert QAR/kWh rates here]

4. **🏭 Industrial (Subsidized)**
   - Need rates: [Insert QAR/kWh rates here]

5. **🏨 Hotel**
   - Need rates: [Insert QAR/kWh rates here]

6. **🏛️ Government**
   - Need rates: [Insert QAR/kWh rates here]

7. **💧 Water Tanker**
   - Need rates: [Insert QAR/kWh rates here]

8. **🐄 EZAB (Livestock)**
   - Need rates: [Insert QAR/kWh rates here]

9. **🌾 Productive Farms**
   - Need rates: [Insert QAR/kWh rates here]

10. **⚙️ Bulk Industrial**
    - Need rates: [Insert QAR/kWh rates here]

---

## 📖 Instructions for Obtaining Rates

**Visit:** https://www.km.qa/CustomerService/Pages/Tariff.aspx

**For each category:**
1. Click on the category icon
2. Note the electricity rate(s) shown
3. Check if there are tiered rates (e.g., first X kWh, then different rate)
4. Record both the rate and any consumption thresholds

---

## 📊 Current Assumptions (Need Verification)

Based on previous research, but **not verified** against current Kahramaa page:

- **Villa (Residential)**: QAR 0.08/kWh (first 4,000 kWh), QAR 0.10/kWh (above)
- **Commercial**: QAR 0.09/kWh (first 4,000), QAR 0.12/kWh (4,001-15,000), QAR 0.14/kWh (above)
- **Hotel**: QAR 0.15/kWh flat
- **Government**: QAR 0.07/kWh flat
- **Others**: Various rates

**⚠️ These need to be verified against the actual Kahramaa page!**

---

## 🎯 Next Steps

Once you provide the exact rates from the Kahramaa page, I will:

1. ✅ Update the `SavingsCalculator.jsx` with correct rates
2. ✅ Update the `ApplicationForm.jsx` facility types
3. ✅ Test calculations with verified data
4. ✅ Document all rates in the integration guide

---

## 📝 Format for Providing Rates

Please provide rates in this format:

```javascript
"Villa (Residential)": {
  "first_4000_kwh": 0.08,
  "above_4000_kwh": 0.10
},
"Commercial": {
  "first_4000_kwh": 0.09,
  "4001_to_15000_kwh": 0.12,
  "above_15000_kwh": 0.14
}
```

Or if flat rates:
```javascript
"Hotel": 0.15,  // Flat rate
"Government": 0.07  // Flat rate
```

---

**🔗 Reference:** https://www.km.qa/CustomerService/Pages/Tariff.aspx

**Once you provide the tariff details from the Kahramaa page, I'll update everything immediately!** ⚡



