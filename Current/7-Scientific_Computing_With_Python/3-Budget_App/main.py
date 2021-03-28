# This entrypoint file to be used in development. Start by reading README.md
import budget
from budget import create_spend_chart
from unittest import main

print()
food = budget.Category("Food")
entertainment = budget.Category('Entertainment')
business = budget.Category('Business')
food.deposit(900, "deposit")
entertainment.deposit(900, "deposit")
business.deposit(900, "deposit")
food.withdraw(105.55)
entertainment.withdraw(33.40)
business.withdraw(10.99)

print(food)
# print(clothing)
# print(auto)
print()
# print(create_spend_chart([food, clothing, auto]))
print(create_spend_chart([business, food, entertainment]))

# Run unit tests automatically
main(module='test_module', exit=False)