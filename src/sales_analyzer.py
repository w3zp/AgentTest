import csv
from collections import defaultdict
from typing import Dict, Tuple


def read_sales_data(path: str) -> Tuple[float, Dict[str, float]]:
    """Read CSV file and compute total revenue and revenue per product."""
    total_revenue = 0.0
    product_revenue = defaultdict(float)

    with open(path, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            quantity = float(row.get("Quantity", 0))
            price = float(row.get("UnitPrice", 0))
            revenue = quantity * price
            total_revenue += revenue
            product_revenue[row.get("Product", "Unknown")] += revenue

    return total_revenue, dict(product_revenue)


def print_report(total: float, product_totals: Dict[str, float], top: int = 3) -> None:
    """Display sales summary report."""
    print(f"Total revenue: ${total:,.2f}")
    print("Top products:")
    sorted_products = sorted(product_totals.items(), key=lambda x: x[1], reverse=True)
    for name, rev in sorted_products[:top]:
        print(f"- {name}: ${rev:,.2f}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Analyze sales CSV data")
    parser.add_argument("path", help="Path to sales CSV file")
    parser.add_argument("--top", type=int, default=3, help="Number of top products to display")
    args = parser.parse_args()

    total, products = read_sales_data(args.path)
    print_report(total, products, top=args.top)


if __name__ == "__main__":
    main()
