# This entrypoint file to be used in development. Start by reading README.md
import shape_calculator
from unittest import main

rect = shape_calculator.Rectangle(4, 8)
rect2 = shape_calculator.Rectangle(3, 6)

print(rect.get_amount_inside(rect2))

# Run unit tests automatically
main(module='test_module', exit=False)