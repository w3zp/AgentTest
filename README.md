# AgentTest

## Sales Analyzer

This project provides a simple Python script to analyze CSV sales data and output revenue statistics.

### Usage

1. Place your sales data in a CSV file with columns: `Date`, `Product`, `Quantity`, `UnitPrice`.
2. Run the analyzer and point it to your CSV file:
   ```bash
   python3 src/sales_analyzer.py path/to/your_sales.csv
   ```
3. The script will display total revenue and the top-selling products.

Example using the included `sample_sales.csv`:
```bash
python3 src/sales_analyzer.py sample_sales.csv
```
